const {Schema,model} = require('mongoose'); // Erase if already required
const DOCUMENT_NAME='Iventory'
const COLLECTION_NAME='Iventories'
// Declare the Schema of the Mongo model !dmbg
var inventoriesSchema = new Schema({
    invent_productId:{type:Schema.Types.ObjectId,ref:'Product'},
    invent_location:{type:String,default:'unknown'},
    invent_stock :{type:Number,required:true},
    invent_shopId :{type:Number,ref:'Shop'},
    invent_reservations :{type:Array,default:[]},
    /**
     * cardId,stock,CreatedOn,
     */

},{
    timestamps:true,
    collection:COLLECTION_NAME
});

//Export the model
module.exports = {
    inventory:model(DOCUMENT_NAME,inventoriesSchema)
};