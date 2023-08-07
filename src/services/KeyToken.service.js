const keytokenModel = require("../models/keytoken.model")

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

            // lv xxx
            const filter = {user:userId},update = {
                publicKey,privateKey,refreshTokenUsed:[],refreshToken
            }, options ={upsert:true,new:true}

            const token =await keytokenModel.findOneAndUpdate(filter,update,options)
            return token ? token.publicKey :null
        } catch (error) {
            return error
        }
    }
}

module.exports=keyTokenService