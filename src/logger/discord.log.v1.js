'use strict'

const {Client,GatewayIntentBits} = require("discord.js")
const client = new Client({
    intents:[
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

client.on('ready',()=>{
    console.log(`logged in as ${client.user.tag}!`)
})

const token = 'MTE5MTkyNDU4NzYyMjA1NTk3Nw.GwBUhb.fUdqaJLm6n6uln9XN4b2J-EvguN9NTqhtOmYGE'
client.login(token)

client.on('messageCreate',msg=>{
    if(msg.author.bot) return
    if(msg.content ==='hello')
    {
        msg.reply("Hello! How can i assits you today!")
    }
})