
const {model,Schema} = require("mongoose")
const DOCUMENT_NAME='Order'
const COLLECTION_NAME='Orders'


const orderSchema = new Schema({
    order_userId:{type:Number,required:true,},
    order_checkout:{type:Object,default:{}},
    /**
     * order_checkout = {
     *  total_price,
     *  total_apply_discount,
     *  feeShip
     * }
     */
    order_shipping:{type:Object,default:{}},
    /**
     * street,
     * city
     * country
     * state
     */
    order_payment:{type:Object,default:{}},
    order_product:{type:Array,required:true},
    order_trackingNumber:{type:String,defaul:'#0000017122023'},
    order_status:{type:String,enum:['pending','confirmed','shipped','cancelled','delivered'],default:'pending'},
    
})


module.exports = {
    order:model(DOCUMENT_NAME,orderSchema)
}