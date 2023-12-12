
const {product,clothing,electronic,furniture} = require('../models/product.model')
const {BadRequest,ForbiddenError} = require('../core/error.response')
const { findAllDrafForShop, PulishProductByshop ,findAllPushlishForShop,unPulishProductByshop, searchProductByuser,
    findAllProduct,findProduct,updateProductById
} 
    = require('../models/repositories/product.repo')
const { removeUndefinedObject } = require('../utils')
const { insertInventory } = require('../models/repositories/inventory.repo')

// define factory class to create product

class ProductFactory{
    /*
        type:'Clothing',
        payload : dữ liệu truyền vào 
    */
    static productRegistry= {}
    static registerProductType(type,classRef)
    {
        ProductFactory.productRegistry[type]=classRef
    }
    static async createProduct(type,payload)
    {
        const productclass =ProductFactory.productRegistry[type]
        if(!productclass)
        {
            throw new BadRequest(`invalid Product type ${type}`)
        }
        return new productclass(payload).createProduct()

    }
    static async updateProduct(type,productId,payload)
    {
        const productclass =ProductFactory.productRegistry[type]
        if(!productclass)
        {
            throw new BadRequest(`invalid Product type ${type}`)
        }
        return new productclass(payload).updateProduct(productId)

    }
    // PUT //
    static async PulishProductByshop({product_shop,product_id}){
        return await PulishProductByshop({product_shop,product_id})
    }
    static async unPulishProductByshop({product_shop,product_id}){
        return await unPulishProductByshop({product_shop,product_id})
    }
    // End PUT //

    // query ///
    static async findAllDrafForShop({product_shop,limit=50,skip=0})
    {
        const query = {product_shop,isDraf:true}
        return await findAllDrafForShop({query,limit,skip})
    }

    static async findAllPushlishForShop({product_shop,limit=50,skip=0})
    {
        const query = {product_shop,isPublish:true}
        return await findAllPushlishForShop({query,limit,skip})
    }

    static async searchProduct({keySearch}){
        return await searchProductByuser({keySearch})
    }
    static async findAllProduct({limit =50,sort='ctime',page=1,filter={isPublish:true}}){
        return await findAllProduct({limit,sort,page,filter,select:['product_name','product_price','product_thumb']})
    }
    // unselect là bỏ trọn những field không liên quan
    static async findProduct({product_id}){
        return await findProduct({product_id,unSelect:['__v','product_variation']})
    }
}
/*
    product_name :{type:String,required:true},
    prodcut_thumb :{type:String,required:true},
    product_description:String,
    product_price:{type:Number,required:true},
    product_quantity:{type:Number,required:true},
    product_type:{type:String ,required:true,enum:['Electronics','Clothing','Furniture']},
    product_shop:{type:Schema.Types.ObjectId,ref:'Shop'},
    product_attributes:{type:Schema.Types.Mixed,required:true}
 */
// define base product class
class Product{
    constructor({
        product_name,product_thumb,product_description,product_price,
        product_quantity,product_type,product_shop,product_attributes
    }){
        this.product_name=product_name
        this.product_thumb=product_thumb
        this.product_description=product_description
        this.product_price=product_price
        this.product_quantity=product_quantity
        this.product_type=product_type
        this.product_shop=product_shop
        this.product_attributes=product_attributes
    }
    // create new product 
    async createProduct(product_id)
    {
        const newProduct =  await product.create({...this,_id:product_id})

        if(newProduct)
        {
            /**
             * add product_stock in inventory collection
             */
            await insertInventory({
                productId:newProduct._id,
                shopId:this.shopId,
                stock:this.product_quantity
            })
        }
        return newProduct
    }

    // update Product
    async updateProduct(productId,bodyUpdate)
    {
        return await updateProductById({productId,bodyUpdate,model:product})
    }
}

// Define sub-class for different product types Clothings
class Clothing extends Product{
    async createProduct(){
        const newClothing = await clothing.create(this.product_attributes)
        if(!newClothing) throw new BadRequest("Create new Clothing error!!")
        
        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequest("create new Clothing error")
        return newProduct
    }
    async updateProduct(productId)
    {
        /**
         * {
         *  a:undifined,
         *  b:null
         * } k truyền những giá trị như v
         */ 
        // 1. remove attribue has val nul or undif
        const objectParams=removeUndefinedObject(this)
        // 2. check xem update o cho nao?
        
        if(objectParams.product_attributes)
        {
            // update child
            await await updateProductById({productId,bodyUpdate,model:clothing})
        }

        const updateProduct = await super.updateProduct(productId,objectParams)

        return updateProduct

    }
}

// Define sub-class for different product types Electronic
class Electronics extends Product{
    async createProduct(){
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop:this.product_shop
        })
        if(!newElectronic) throw new BadRequest("Create new Electronics error!!")
        
        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw new BadRequest("create new Electronics error")
        return newProduct
    }

}
class Furniture extends Product{
    async createProduct(){
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop:this.product_shop
        })
        if(!newFurniture) throw new BadRequest("Create new Furnitures error!!")
        
        const newProduct = await super.createProduct(newFurniture._id)
        if(!newProduct) throw new BadRequest("create new Furnitures error")
        return newProduct
    }
}
ProductFactory.registerProductType('Electronics',Electronics)
ProductFactory.registerProductType('Furniture',Furniture)
ProductFactory.registerProductType('Clothing',Clothing)

module.exports = ProductFactory