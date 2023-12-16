const express =require('express')
const route= express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');
const cartController = require('../../controller/cart.controller');

route.post('',asyncHandler(cartController.addToCart))
route.delete('',asyncHandler(cartController.delete))
route.post('/update',asyncHandler(cartController.update))
route.get('',asyncHandler(cartController.list))




module.exports = route