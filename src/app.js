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
// init db
require('./dbs/init.mongodb')
//const {checkOverload} = require('./helpers/check.connect')
//checkOverload();
// init route
app.use('/',require('./routes'))
// handling error

module.exports = app