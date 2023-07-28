const express =require('express')
const accessController =require('../../controller/access.controller')
const route= express.Router();

// signUp 
route.post('/shop/signup',accessController.signUp)

module.exports=route