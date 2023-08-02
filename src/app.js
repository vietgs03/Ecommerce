require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const {default:helmet} = require("helmet")
const compression = require("compression")
const app = express()

// init middlewares
app.use(morgan("dev"))
//morgan("combined") for product
//morgan("common")
//morgan("short")
//morgan("tiny")
//morgan("dev") for dev
app.use(helmet())
app.use(compression()) // giảm tải 
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
// init db
require('./dbs/init.mongodb')
//const {checkOverload} = require('./helpers/check.connect')
//checkOverload();
// init route
app.use('/',require('./routes'))
// handling error
app.use((req,res,next)=>{
    const error = new Error('Not found')
    error.status=404
    next(error)
})
app.use((error,req,res,next)=>{
    const statusCode =error.status || 500
    return res.status(statusCode).json({
        status:'error',
        code:statusCode,
        message:error.message || 'Internal server error'
    })
})
module.exports = app