
const {model,Schema} = require('mongoose')

const DOCUMENT_NAME='Cart'
const COLLECTION_NAME='Carts'

const CartSchema= new Schema({
    cart_state:{
        type:String,required:true,
        enum:['active','complete','failed','pending'],
        default:'active',
    },
    cart_products:{type:Array,required:true,defaul:[]},
    cart_count_product:{type:Number,default:0},
    cart_userId:{type:Number,required:true},

},{
    collection:COLLECTION_NAME,
    timestamps:{
        createdAt:'createdOn',
        updatedAt:'modifiedOn'
    }
})

module.exports={
    cart:model(DOCUMENT_NAME,CartSchema)
}