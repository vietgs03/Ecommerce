
const { BadRequest } = require("../core/error.response")
const {
    inventory
} = require("../models/inventory.model")
const {
    order
} = require("../models/order.model")
const { getProductByid } = require("../models/repositories/product.repo")

class InventoryService {
    static async addStocktoInvetory({
        stock,
        productId,
        shopId,
        location='21 banh van tran',
    })
    {
        const product = await getProductByid(productId)
        if(!product) throw new BadRequest("The product doesnot exists!!!")

        const query = {invent_shopId:shopId,invent_productId:productId},
        updateSet ={
            $inc:{
                invent_stock:stock
            },
            $set:{
                invent_location:location
            }
        },options = {upsert:true,new:true}

        return await inventory.findOneAndUpdate(query,updateSet,options)
    }

 
     
}


module.exports = InventoryService