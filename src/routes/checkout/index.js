const express =require('express')
const route= express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');
const checkoutController = require('../../controller/checkout.controller');

route.post('review',asyncHandler(checkoutController.checkoutReview))

module.exports = route