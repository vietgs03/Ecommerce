
const {model,Schema} = require("mongoose")
const DOCUMENT_NAME='Order'
const COLLECTION_NAME='Orders'


const orderSchema = new Schema({

})


module.exports = {
    order:model(DOCUMENT_NAME,orderSchema)
}