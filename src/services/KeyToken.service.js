const keytokenModel = require("../models/keytoken.model")
const { Types: { ObjectId } } = require('mongoose')
class keyTokenService {
    static createKeyToken = async ({userId,publicKey,privateKey,refreshToken})=>
    {
        try {
            // lv 0 
            // const token = await keytokenModel.create({
            //     userId,
            //     publicKey,
            //     privateKey
            // })
            // return token ? token.publicKey :null

            // lv xxxrefreshToken
            const filter = {user:userId},update = {
                publicKey,privateKey,refreshTokenUsed:[],refreshToken
            }, options ={upsert:true,new:true}

            const token =await keytokenModel.findOneAndUpdate(filter,update,options)
            return token ? token.publicKey :null
        } catch (error) {
            return error
        }
    }
    
    static findByUserId = async ({userId})=>{
        return await keytokenModel.findOne({ user: new ObjectId(userId) }).lean();

    }

    static removeKeybyId = async(id)=>{
        return await keytokenModel.deleteOne({ _id: new ObjectId(id) });
    }

    static findByRefreshTokenUsed = async(refreshToken)=>{
        return await keytokenModel.findOne({refreshTokenUsed:refreshToken}).lean()
    }

    static findByRefreshToken = async(refreshToken)=>{
        return await keytokenModel.findOne({refreshToken})
    }

    static deleteKeyById = async(userId)=>{
        return await keytokenModel.findByIdAndDelete({user:userId})
    }
}

module.exports=keyTokenService