const express =require('express')
const accessController =require('../../controller/access.controller')
const route= express.Router();
const {asyncHandler} = require('../../auth/checkAuth')

// signUp 
route.post('/shop/signup', asyncHandler(accessController.signUp))

module.exports=route