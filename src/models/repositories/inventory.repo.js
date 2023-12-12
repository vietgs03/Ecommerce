const { inventory } = require("../inventory.model")
const {Types} =require("mongoose")
const insertInventory = async({
    productId,shopId,stock,location='unkown'
})=>{
    return await inventory.create({
        invent_productId:productId,
        invent_stock:stock,
        invent_location:location,
        invent_shopId:shopId,

    })
}


module.exports={
    insertInventory
}