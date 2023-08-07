const express =require('express')
const accessController =require('../../controller/access.controller')
const route= express.Router();
const {asyncHandler} = require('../../auth/checkAuth')

// signUp 
route.post('/shop/signup', asyncHandler(accessController.signUp))
route.post('/shop/signin', asyncHandler(accessController.login))

module.exports=route