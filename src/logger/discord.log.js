const {Client,GatewayIntentBits} = require("discord.js")
const {
    CHANELID_DISCORD,
    TOKEN_DISCORD
} = process.env
class LoggerService {
    constructor()
    {
        this.client = new Client({
            intents:[
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ]
        })
        // add chanel id
        this.chanelId = CHANELID_DISCORD
        this .client.on('ready',()=>{
            console.log(`Logged in as ${this.client.user.tag}`)
        })
        this.client.login(TOKEN_DISCORD)
    }
    sendToFormatCode(logData)
    {
        const {code,message='This is some additional information about the code.',title='code example'}=logData
        if(1===1){
            //product and dev co can ghi log hay ko
            
        }
        const codeMessage ={
            content:message,
            embeds:[
                {
                    color:parseInt("00ff00",16),
                    title,
                    description:"```json\n"+JSON.stringify(code,null,2)+'\n```',
                },
            ],
        }
        this.sendToMessage(codeMessage)
    }

    sendToMessage(message='message')
    {
        const chanel =this.client.channels.cache.get(this.chanelId)
        if(!chanel){
            console.error(`Couldnt find the chanel id`,this.chanelId)
            return
        }
        chanel.send(message).catch(e=>console.error(e))
    }
}
module.exports = new LoggerService()