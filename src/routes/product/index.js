const express =require('express')
const ProductController =require('../../controller/product.controller')
const route= express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');


//authentication///
route.use(authenticationV2)
/////
route.post('',asyncHandler(ProductController.createProduct))

module.exports=route