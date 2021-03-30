import * as Discord from "discord.js"
import { DiscordBotToken, Reaccioner, Receiber, Channel_ID } from './env'

const backTicks = "```"
const l = "------------------------------------------------"

const client = new Discord.Client();

const deleteDMMessage = (message: Discord.Message|Discord.PartialMessage) => {
    message.author.createDM().then(dm => {
        dm.messages.fetch(message.content).then(message => {
            message.delete()
        }).catch( err => console.log("No se pudo eliminar el mensaje: "+err))
    })
}

client.on("ready", async () => {
    await client.users.fetch(Reaccioner, true)
    await client.users.fetch(Receiber, true)
    const channel = await client.channels.fetch(Channel_ID)

    if (channel.isText()) {
        await channel.messages.fetch();
    }

    console.log("¡Estoy listo!");
});

client.on("message", (message) => {
    if (message.content.startsWith("isActive")) {
        message.channel.send("true");
    }

    if(message.content.length==18) {
        deleteDMMessage(message)
    }
});

client.on("messageReactionAdd", (reaction: Discord.MessageReaction, user: Discord.User|Discord.PartialUser) => {
    let emoji = reaction.emoji.name

    console.log(emoji)
    console.log(emoji==='☑️')

    if (emoji === '☑️' && user.id == Reaccioner) {
        const messageReceiber = client.users.cache.find(user => user.id == Receiber)
        
        if(messageReceiber) {
            messageReceiber.send(`${l}\nDebes agregar a un usuario que escribió este mensaje: ${backTicks+reaction.message.content+backTicks}Usuario: ${reaction.message.author.username}\nID: ${reaction.message.author.id}\nCanal ID: ${reaction.message.channel.id}\n${l}`)
        
            const consoleChat: Discord.TextChannel = client.channels.cache.find(channel => channel.id == Channel_ID) as Discord.TextChannel
            if (consoleChat) consoleChat.send("☑️ Se ha enviado un mensaje al recibidor correspondiente.")
        }
    }    
})

client.on("messageUpdate", (message) => {
    if (message.content.startsWith("updatedWorks")) {
        console.log("true");
    }

    if(message.content.length==18) {
        deleteDMMessage(message)
    }
});

client.login(DiscordBotToken);