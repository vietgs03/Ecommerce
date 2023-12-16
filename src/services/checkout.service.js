const { BadRequest } = require("../core/error.response")
const { product } = require("../models/product.model")
const { findCartById } = require("../models/repositories/card.repo")
const { checkProductBySever } = require("../models/repositories/product.repo")
const { checkout } = require("../routes")
const { getDiscountAmount } = require("./discount.service")

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
}

module.exports = CheckoutService