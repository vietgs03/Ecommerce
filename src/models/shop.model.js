const {model,Schema,Types} = require('mongoose'); // Erase if already required
const DOCUMENT_NAME='Shop'
const COLLECTION_NAME ='Shops'
// Declare the Schema of the Mongo model
//!dmbgum
var shopSchema = new Schema({
    name:{
        type:String,
        trim:true,
        maxLength:true,
    },
    email:{
        type:String,
        unique:true,
        trim:true,
    },
    status:{
        type:String,
        required:true,
        enum:['active','inactive'],
        default:'inactive'
    },
    password:{
        type:String,
        required:true,
    },
    verify:{
        type:Schema.Types.Boolean,
        default:false
    },
    roles:{
        type:Array,
        default:[]
    }
},{
    timestamps:true,
    collection:COLLECTION_NAME
}
);

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);