const keytokenModel = require("../models/keytoken.model")

class keyTokenService {
    static createKeyToken = async ({userId,publicKey,privateKey})=>
    {
        try {
            const token = await keytokenModel.create({
                userId,
                publicKey,
                privateKey
            })
            return token ? token.publicKey :null
        } catch (error) {
            return error
        }
    }
}

module.exports=keyTokenService