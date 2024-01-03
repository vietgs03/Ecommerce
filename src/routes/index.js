const express = require('express');

const route = express.Router();
const { apiKey, permission } = require('../auth/checkAuth');
const {pushTologDiscord} = require('../middlewares')
// add log to discord router
route.use(pushTologDiscord)
//check APi
debugger
route.use(apiKey) //=> trỏ tới middleware (auth)
//check permission
route.use(permission('0000'))

route.use('/v1/api/checkout', require('./checkout/index'))
route.use('/v1/api/discount', require('./discount/index'))
route.use('/v1/api/cart', require('./cart/index'))
route.use('/v1/api/product', require('./product/index'))
route.use('/v1/api', require('./access/index'))

//check permission

module.exports = route