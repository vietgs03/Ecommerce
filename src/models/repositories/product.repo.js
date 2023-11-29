const {product,electronic,furniture,clothing} = require("../../models/product.model")
const {Types} = require("mongoose")
const findAllDrafForShop = async({query,limit,skip})=>{
    return await queryProduct({query,limit,skip})

}
const findAllPushlishForShop = async({query,limit,skip})=>{
    return await queryProduct({query,limit,skip})

}
const searchProductByuser = async ({keySearch})=>{
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        isPublish:true,
        $text:{$search:regexSearch}},
        {score:{$meta:'textScore'}})
        .sort({score:{$meta:'textScore'}}).lean()
    return results

}

const PulishProductByshop = async({product_shop,product_id})=>{
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if(!foundShop)
    {
        return null
    }

    foundShop.isDraf = false
    foundShop.isPublish = true
    const {modifiedCount} = await foundShop.updateOne(foundShop)
    return modifiedCount
}
const unPulishProductByshop = async({product_shop,product_id})=>{
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if(!foundShop)
    {
        return null
    }

    foundShop.isDraf = true
    foundShop.isPublish = false
    const {modifiedCount} = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const queryProduct =async({query,limit ,skip})=>{
    return await product.find(query)
    .populate('product_shop','name email -_id')
    .sort({updateAt:-1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

module.exports={
    findAllDrafForShop,
    PulishProductByshop,
    findAllPushlishForShop,
    unPulishProductByshop,
    searchProductByuser
}