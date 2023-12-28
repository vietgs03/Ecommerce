const { BadRequest } = require("../core/error.response")
const { product } = require("../models/product.model")
const { findCartById } = require("../models/repositories/card.repo")
const { checkProductBySever } = require("../models/repositories/product.repo")
const { checkout } = require("../routes")
const { getDiscountAmount } = require("./discount.service")
const { acquireLock, releaseLock } = require("./redis.service")
const {order} =require("../models/order.model")
class CheckoutService{
    //login and without login
    /**
        {
            cartId,
            userId,
            shop_order_ids:[
                {
                    shopId,
                    shop_discounts:[],
                    item_products:{
                        price,
                        quantity,
                        productId
                    }
                },
                {
                    shopId,
                    shop_discounts:[],
                    item_products:{
                        price,
                        quantity,
                        productId
                    }
                },
            ]
        }
     */

    static async checkoutReview({
        cartId,userId,shop_order_ids=[]
    }){
        //check cartId tồn tai hay khong
        const foundCart = await findCartById(cartId)
        if(!foundCart) throw new BadRequest("cart doesn't exists!")

        const checkout_order = {
            totalPrice:0, // tong tien hang
            feeShip :0, // phí vận chuyển
            totalDiscount:0 , // tổng tiền discount giảm giá 
            totalCheckout:0,  // tổng thanh toán
            
        }, shopOrder_ids_new=[]

        // tính tổng tiền bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const {shopId,shop_discounts=[],item_products=[]}  = shop_order_ids[i]
            //check available
            const checkProductSever = await checkProductBySever(item_products)

            if(!checkProductSever[0]) throw new BadRequest('order wrong!!!')
            
            //tong tien don hang
            const checkoutPrice =checkProductSever.reduce((acc,product)=>{
                return acc + (product.quantity+product.price)
            },0)

            // tong tien truoc khi xu ly 
            checkout_order.totalPrice =+checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw:checkoutPrice, // tong tien truoc khi giam gia
                priceApplyDiscount :checkoutPrice,
                item_products:checkProductSever,

            }
            // nếu shop_discount ton tai > 0  , check xem co hop le hay khong

            if(shop_discounts.length>0)
            {
                // gia su chi co mot discount
                // get amount discount
                const {totalPrice=0,discount= 0} = await getDiscountAmount({
                    codeId:shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products:checkProductSever
                })

                // tong discount giam gia 
                checkout_order.totalCheckout += discount
                // neu tien giam gia lon hon không
                if(discount >0)
                {
                    itemCheckout.priceApplyDiscount = checkoutPrice- discount
                }

            }
            
            // tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        } // end forloop

        return {
            shop_order_ids,
            shopOrder_ids_new,
            checkout_order
        }

    }

    static async orderByUser({
        shop_order_ids_new,
        cartId,
        userId,
        user_address ={},
        user_payment = {}
    }){
        const {shopOrder_ids_new,checkout_order} = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids:shopOrder_ids_new,
        })

        // check lai mot lan nua xem vuot ton kho hay khong
        // get new array product
        const products = shop_order_ids_new.flatMap(order =>order.item_products)
        const acquireProduct = []
        for (let i = 0; i < products.length; i++) {
            const {productId,quantity} = products[i]
            const keyLock = await acquireLock(productId,quantity,cartId)
            acquireProduct.push(keyLock?true:false)
            if(keyLock)
            {
                await releaseLock(keyLock)
            }
        }

        // check neu co 1 san pham het hang trong khi
        if(acquireLock.includes(false))
        {
            throw new BadRequest("Mot so san pham da duoc cap nhap, vui long quay lai gio hang...")
        }
        const newOrder= await order.create({
            order_userId:userId,
            order_checkout:checkout_order,
            order_shipping:user_address,
            order_payment:user_payment,
            order_product:shop_order_ids_new
        })
        // neu insert thanh cong thi remove product co trong gio hang

        if(newOrder)
        {
            // remove prodcut in my cart
        }

        return newOrder
    }
    
    /*
        query orders [Users]
    */
   static async getOrdersByUser({order_userId}){

        return await order.findById({
            order_userId:+order_userId
        })
    }

    /*
    query orders using Id [Users]
    */
    static async getOneOrderByuser(order_userId){
        return await order.findOne(
            order_userId
        )
    }

    /*
        cancel orders[Users]
    */
    // static async cancelOrderByuser(){

    // }

    /*
        update orders status [Shop | Admin]
    */
    // static async updateOrderstatus(){
    
    // }
}
module.exports = CheckoutService