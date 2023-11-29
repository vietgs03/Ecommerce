const ProductService = require("../services/product.service");
const {OK,CREATED,SuccessResponse}  = require("../core/success.response")
class ProductController {

    createProduct = async (req,res,next)=>{
        // new SuccessResponse({
        //     message:'Create new product Success',
        //     metadata: await ProductService.createProduct(req.body.product_type,{
        //         ...req.body,
        //         product_shop:req.user.UserId
        //     })
        // }).send(res)
        new SuccessResponse({
            message:'Create new product Success',
            metadata: await ProductService.createProduct(req.body.product_type,{
                ...req.body,
                product_shop:req.user.UserId
            })
        }).send(res)
    }
    publishProductbyShop = async (req,res,next)=>{
        new SuccessResponse({
            message:'publishProductbyShop Success',
            metadata: await ProductService.PulishProductByshop({
                product_id:req.params.id,
                product_shop:req.user.UserId
            })
        }).send(res)
    }
    unpublishProductbyShop = async (req,res,next)=>{
        new SuccessResponse({
            message:'unpublishProductbyShop Success',
            metadata: await ProductService.unPulishProductByshop({
                product_id:req.params.id,
                product_shop:req.user.UserId
            })
        }).send(res)
    }

    /// query ///
    /**
     * @desc get all Draf for shop
     * @param {Number} limit 
     * @param {Number} skip
     * @return { JSON }
     */
    getAllDrafForShop = async (req,res,next) =>
    {
        new SuccessResponse({
            message:'Get List draf success!',
            metadata: await ProductService.findAllDrafForShop({
                product_shop:req.user.UserId
            })
        }).send(res)
    }

    /**
     * @desc get all publish for shop
     * @param {Number} limit 
     * @param {Number} skip
     * @return { JSON }
     */
    getAllPublishForShop = async (req,res,next) =>
    {
        new SuccessResponse({
            message:'Get List publish success!',
            metadata: await ProductService.findAllPushlishForShop({
                product_shop:req.user.UserId
            })
        }).send(res)
    }
    getListSearchProduct = async (req,res,next) =>
    {
        new SuccessResponse({
            message:'Get List search product success!',
            metadata: await ProductService.searchProduct(req.params)
        }).send(res)
    }
    /// end query ///

}

module.exports= new ProductController();