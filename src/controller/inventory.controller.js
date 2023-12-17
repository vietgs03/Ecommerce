const InventoryService = require("../services/inventory.service")
const {SuccessResponse} = require("../core/success.response")

class InventoryController {
    
    addStocktoInventory = async (req,res,next)=>{
        new SuccessResponse({
            message:"Add stock to inventory success",
            metadata: await InventoryService.addStocktoInvetory(req.body)
        }).send(res)
    }
}

module.exports = new InventoryController()