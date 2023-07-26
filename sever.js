const app = require("./src/app");
const PORT = 3055;
const sever = app.listen(PORT,()=>{
    console.log(`Ecommer start with PORT : ${PORT}`)
})

// process.on('SIGINT',()=>{
//     sever.close( ()=> console.log(`Exit sever Express`))
//     // notifycation in here 
    
// })