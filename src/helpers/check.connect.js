const { default: mongoose } = require("mongoose")
const os =require('os') 
const process = require('process')
const _SECOND = 5000
const countConnect = ()=>{
    const num = mongoose.connect.length
    console.log(`Number ${num}`)
}

// check over load 
const checkOverload = () => {
    setInterval(() =>{
        const numConnect = mongoose.connect.length
        const numCores = os.cpus.length
        const memoryUsage = process.memoryUsage().rss
        // example maxium number of connection base  on number of core
        const maxConnection = numCores * 5 
        console.log(`Active connection : ${numConnect}`)
        console.log(`Memory usage ${memoryUsage/1024/1024} MB`)

        if (numConnect > maxConnection)
        {
            console.log(`Connection overload detected-- ${numConnect}`)
            // notifycation in here
        }
    },_SECOND) // Monitor every 5 second 
}
module.exports = {
    countConnect
    ,checkOverload
}