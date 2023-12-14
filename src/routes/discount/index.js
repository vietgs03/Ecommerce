const express =require('express')
const route= express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');
const discountController = require('../../controller/discount.controller');

//get amount a discount
route.post('/amount',asyncHandler(discountController.getDiscountAmount))
route.get('/list_product_code',asyncHandler(discountController.getAllDiscountCodeWithProduct))

//authentication///
route.use(authenticationV2)

route.post('',asyncHandler(discountController.createDiscountCode))
route.get('',asyncHandler(discountController.getAllDiscountCode))

module.exports = route