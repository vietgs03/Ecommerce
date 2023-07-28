const express =require('express')

const route= express.Router();

route.use('/v1/api',require('./access/index'))
// route.get('',(req,res)=>{
//     return res.status(200).json({
//         message:'welcome'
//     })
// })

module.exports=route