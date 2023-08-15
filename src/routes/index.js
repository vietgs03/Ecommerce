const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');

const route = express.Router();
//check APi
debugger
route.use(apiKey) //=> trỏ tới middleware (auth)
//check permission
route.use(permission('0000'))
route.use('/v1/api', require('./access/index'))
route.use('/v1/api/product', require('./product/index'))

//check permission

module.exports = route