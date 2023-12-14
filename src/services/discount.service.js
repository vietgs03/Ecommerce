'use strict'
const { min } = require('lodash')
const {
    BadRequest,
    NotFoundError
} = require('../core/error.response')
const {discount} = require('../models/discount.model')
const {convertToObjectIdMongoDb} = require('../utils/index')
const {findAllProduct}= require('../models/repositories/product.repo')
const { findAllDiscountCodesUnSelect, checkDiscountExists } = require('../models/repositories/discount.repo')
const { product } = require('../models/product.model')

/**
 * discount service
 * 1 - generate discount code (admin)
 * 2 - get discount amount (user)
 * 3 - get all discount code (user | shop)
 * 4 - verify discount code (user)
 * 5 - Delete discount code (shop|admin)
 * 6 - Cancel discount code (user)
 */
class DiscountService {

    static async createDiscount(payload)
    {
        const {
            code , start_date ,end_date,is_active,
            shopId,min_order_value,product_ids,applies_to,name,
            description,type,value,max_value,max_uses,uses_count,
            max_uses_per_user,users_used
        }= payload

        // kiem tra
        if(new Date() < new Date(start_date) || new Date() > new Date(end_date))
        {
            throw new BadRequest('Discount code has expried')
        }

        if(new Date(start_date) >= new Date(end_date))
        {
            throw new BadRequest('Start date must be before end_date code has expried!')
        }

        // create index for discount code
        const foundDiscount = await discount.findOne({
            discount_code:code,
            discount_shopId:shopId,

        }).lean()

        if(foundDiscount && foundDiscount.discount_is_active)
        {
            throw new BadRequest('Discount exists!')
        }

        const newDiscount =await discount.create({
            discount_name :name,
            discount_description:description,
            discount_type:type, 
            discount_value:value, // 10.000
            discount_code : code, // code discount
            discount_start_date:new Date(start_date), // ngay bat dau
            discount_end_date:new Date(end_date), // ngay ket thuc
            discount_max_uses:max_uses, // so luong discount duoc ap dung
            discount_uses_count :uses_count, // so luong discount da su dung
            discount_users_used:users_used, // 
            discount_max_uses_per_users :max_uses_per_user ,//
            discount_min_order_value :min_order_value||0,
            discount_shopId :shopId,
            discount_is_active:is_active,
            discount_applies_to:applies_to,
            discount_product_ids :applies_to === 'all'?[]:product_ids
        })

        return newDiscount
    }

    static async updateDiscountCode()
    {
        // .. 
    }

    /**
     * get all discount codes available with products
     */

    static async getAllDiscountCodesWithProduct({
        code,shopId,userId,limit,page
    }) {
        // create index for discount_code 
        const foundDiscount = await discount.findOne({
            discount_code:code,
            discount_shopId:convertToObjectIdMongoDb(shopId),

        }).lean()

        if(!foundDiscount || !foundDiscount.discount_is_active)
        {
            throw new NotFoundError('discount not exits')
        }

        const {discount_applies_to,discount_product_ids}= foundDiscount
        let products
        if(discount_applies_to === 'all')
        {
            //get all product 
            products = await findAllProduct({
                filter:{
                    product_shop:convertToObjectIdMongoDb(shopId),
                    isPublish:true,
                },
                limit:+limit,
                page:+page,
                sort:'ctime',
                select:['product_name']
            })
        }

        if(discount_applies_to === 'specific')
        {
            // get the product ids
            products = await findAllProduct({
                filter:{
                    _id:{$in:discount_product_ids},
                    isPublish:true,
                },
                limit:+limit,
                page:+page,
                sort:'ctime',
                select:['product_name']
            })
        }
        return products
    }

    /**
     * get all discount code of Shops
     */
    
    static async getAllDiscountCodesByShop(limit,page,shopId){
        const discounts = await findAllDiscountCodesUnSelect({
            limit :+limit,page:+page,
            filter:{
                discount_shopId:convertToObjectIdMongoDb(shopId),
                discount_is_active:true
            },
            unSelect:['__v','discount_shopId'],
            model:discount
        })
        
        return discounts
    }


    /**
     * Apply discount code
     * product .... productId, shopId,quantity,name , price
     * 
     */

    static async getDiscountAmount({codeId,userId,shopId,products})
    {
        const foundDiscount= await checkDiscountExists({
            model:discount,
            filter:{
                discount_code:codeId,
                discount_shopId:convertToObjectIdMongoDb(shopId)
            }
        })

        if(!foundDiscount)
        {
            throw new NotFoundError('Discount doesnt exists')
        }

        const {
            discount_is_active
            ,discount_max_uses,
            discount_min_order_value,
            discount_users_used,
            discount_max_uses_per_users
        } = foundDiscount

        if(!discount_is_active ) throw new NotFoundError('Discount Expried!')
        if(!discount_max_uses ) throw new NotFoundError('Discount are out!')
        if(new Date < new Date(discount_start_date) ||new Date > new Date(discount_end_date) ) {
            throw new NotFoundError('Discount ecode has Expried!')

        }
        // check xem co gia tri toi thieu hay khong
        let totalOrder = 0
        if(discount_min_order_value>0)
        {
            // get total 
            totalOrder = products.reduce((acc,product)=>{
                return acc +(product.quantity * product.price)
            },0)

            if(totalOrder < discount_min_order_value)
            {
                throw new NotFoundError(`discount requires a minium order value of  ${discount_min_order_value}!`)
            }
        }

        if(discount_max_uses_per_users >0)
        {
            const userUsedDiscount= discount_users_used.find(user=>user.userId === userId)
            if(userUsedDiscount)
            {

            }
        }

        //check xem discount nay la fixed_amount
        const amount = discount_type === 'fixed_amount'?discount_value:totalOrder*(discount_value/100)

        return {
            totalOrder,discount:amount,totalPrice:totalOrder-amount
        }
    }

    static async deleteDiscountCode({
        shopId,
        codeId
    }){

        const deleted = await discount.findOne({
            discount_code:codeId,
            discount_shopId:convertToObjectIdMongoDb(shopId)
        })

        return deleted
    }

    /**
     * 
     *  {cancel discount code}  
     */
    static async cancelDiscountCode({
        codeId,shopId,userId
    }){
        const foundDiscount = await checkDiscountExists({
            model:discount,
            filter:{
                discount_code:codeId,
                discount_shopId:convertToObjectIdMongoDb(shopId)
            }
        })
        if(!foundDiscount) throw new NotFoundError('Discount doesnt exists')

        const result = await discount.findByIdAndUpdate(foundDiscount._id,{
            $pull:{
                discount_users_used:userId,
            },
            $inc:{
                discount_max_uses:1,
                discount_uses_count:-1
            },

        })

        return result
    }
}

module.exports= DiscountService