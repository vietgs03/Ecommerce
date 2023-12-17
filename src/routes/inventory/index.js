const express =require('express')
const route= express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');
const InventoryController = require('../../controller/inventory.controller');
const inventoryController = require('../../controller/inventory.controller');

route.use(authenticationV2)
route.post('',asyncHandler(inventoryController.addStocktoInventory))

module.exports = route