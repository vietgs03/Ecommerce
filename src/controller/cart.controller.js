'use strict'

const CartService = require("../services/cart.service")
const {OK,CREATED,SuccessResponse}  = require("../core/success.response")


class CartController {

    /**
     * @desc add to card for user
     * @param {int} UserId
     * @method POST 
     * @url v1/api/cart/api/....
     * @return {
     * }
     */
    addToCart = async (req,res,next) =>
    {
        new SuccessResponse({
            message:'create new success',
            metadata: await CartService.addToCard(req.body)
        }).send(res)
    }

    // update + - sp
    update = async (req,res,next) =>{
        //
        new SuccessResponse({
            message:'create new success',
            metadata:await CartService.addToCardV2(req.body)
        }).send(res)
    }

    delete = async (req,res,next) =>{
        //
        new SuccessResponse({
            message:'delete new success',
            metadata:await CartService.deleteUserCart(req.body)
        }).send(res)
    }

    list = async (req,res,next) =>{
        //
        new SuccessResponse({
            message:'get list cart success',
            metadata:await CartService.getListUserCart(req.query)
        }).send(res)
    }
}

module.exports = new CartController()