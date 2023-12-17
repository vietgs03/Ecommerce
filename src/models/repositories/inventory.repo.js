const { convertToObjectIdMongoDb } = require("../../utils")
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

// dat hang thi tru di ton kho
const reservationInventory = async ({productId,quantity,cartId})=>{
    const query= {
        invent_productId:convertToObjectIdMongoDb(productId),
        invent_stock:{$gte:quantity}
    }, updateSet = {
        $inc:{
            invent_stock: - quantity
        },
        $push:{
            invent_reservations:{
                quantity,
                cartId,
                createOn:new Date()

            }
        }
    }, options ={upsert:true,new:true}
    return await inventory.updateOne(query,updateSet)
}

module.exports={
    insertInventory,
    reservationInventory
}