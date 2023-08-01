const express =require('express');
const { apiKey,permission } = require('../auth/checkAuth');

const route= express.Router();
//check APi
route.use(apiKey) //=> trỏ tới middleware (auth)
//check permission
route.use(permission('0000'))
route.use('/v1/api',require('./access/index'))

//check permission

module.exports=route