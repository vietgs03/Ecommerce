'use strict'

const DiscountService = require("../services/discount.service")
const {OK,CREATED,SuccessResponse}  = require("../core/success.response")

class DiscountController {
    createDiscountCode = async (req,res,next)=>{
        new SuccessResponse({
            message:"success code generate",
            metadata: await DiscountService.createDiscount({
                ...req.body,
                shopId:req.user.UserId
            })
        }).send(res)
    }

    getAllDiscountCode = async (req,res,next)=>{
        new SuccessResponse({
            message:"success code found",
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId:req.user.UserId
            })
        }).send(res)
    }

    getDiscountAmount = async (req,res,next)=>{
        new SuccessResponse({
            message:"success code found",
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.body
            })
        }).send(res)
    }

    getAllDiscountCodeWithProduct = async (req,res,next)=>{
        new SuccessResponse({
            message:"success code found",
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }

}

module.exports = new DiscountController()