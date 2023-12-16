const { cart } = require("../models/cart.model");
const {
    BadRequest,
    NotFoundError
} = require('../core/error.response');
const { getProductByid } = require("../models/repositories/product.repo");

class CartService {
    

    /// START REPO CART ///
    static async createUserCart({userId,product})
    {
        const query ={cart_userId:userId,cart_state:'active'},
        updateOrInsert ={
            $addToSet:{
                cart_products:product
            }
        },options = {upsert:true,new:true}
        return await cart.findOneAndUpdate(query,updateOrInsert,options)
    }

    static async updateUserCartQuantity({userId,product})
    {
        const {productId,quantity} = product
        const query = {
            cart_userId:userId,
            'cart_products.productId':productId,
            cart_state:'active'
        },updateSet = {
            $inc:{
                'cart_product.$.quantity':quantity
            }
        },options = {upsert:true,new:true}
        return await cart.findOneAndUpdate(query,updateOrInsert,options)
    }
    /// END REPO CART ///
    static async addToCard({userId,product={}})
    {
        // check cart tồn tại hay không 
        const userCart = await cart.findOne({
            cart_userId:userId
        })
        if(!userCart)
        {
            //create new card
            return await CartService.createUserCart({userId,product})

        }

        // neu co gio hang roi nhung chua co san pham

        if(!userCart.cart_products.length)
        {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        // neu gio hang nay ton tai va khac rong thi update quantity 
        return await CartService.updateUserCartQuantity({userId,product})
    }


    static async addToCardV2({userId,product={} })
    {
        const {productId,quantity,old_quantity} = shop_order_ids[0]?.item_products[0]
        // check product
        const foundProduct = await getProductByid(productId)
        if(!foundProduct) throw new NotFoundError("Product not exists")

        // compare 
        if(foundProduct.product_shop.toString()!= shop_order_ids[0]?.shopId) {
            throw new NotFoundError("Product not exists")
        }
        
        if(quantity===0)
        {
            // deleted

        }

        return await CartService.updateUserCartQuantity({
            userId,
            product:{
                productId,
                quantity:quantity-old_quantity
            }
        })
    }

    static async deleteUserCart({userId,productId})
    {
        const query = { cart_userId:userId,cart_state:'active'},
        updateSet ={
            $pull:{
                cart_products :{
                    productId
                }
            }
        }
        const deleteCart = await cart.updateOne(query,updateSet)
        return deleteCart
    }

    static async getListUserCart({userId})
    {
        return await cart.findOne({
            cart_userId:+userId
        }).lean()
    }
}

module.exports= CartService