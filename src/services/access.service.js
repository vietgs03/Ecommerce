// chỉ làm viec với service và model nên viết static cho lẹ
const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const keyTokenService = require("./KeyToken.service")
const {createTokenPair} = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequest,ConflictRequestError } = require("../core/error.response")
const RoleShop = {
    SHOP:'SHOP',
    WRITER:'WRITER',
    EDITOR:'EDITOR',
    ADMIN:'ADMIN'
}
class AccessService
{
    static signUp = async ({name,email,password}) =>{
        //try {
            // check email exists?
            const holderShop = await shopModel.findOne({email}).lean()// lean trả về object nhanh hơn 
            if(holderShop)
            {
                throw new BadRequest('Error: Shop already registed')
            }
            const passwordHash = await bcrypt.hash(password,10);
            const newShop = await shopModel.create({
                name,email,password:passwordHash,role:[RoleShop.SHOP]
            })
            if(newShop){
                // create privateKey , publicKey
                // privateKey đẩy cho người dùng k lưu trong hệ thống
                // publickey thì lưu trong hệ thống  
                // publickey dùng để verify token
                // giả sử hacker hack được vào hệ thống của chúng ta lấy được publickey nhưng không dùng để sign token
                // nó chỉ có nvu verify nên phải biết được cả 2 dạng key

                // const {privateKey,publicKey} = crypto.generateKeyPairSync('rsa',{
                //     modulusLength:4096,
                //     publicKeyEncoding:  {
                //         type:'pkcs1',
                //         format:'pem'
                //     },
                //     privateKeyEncoding:  {
                //         type:'pkcs1',
                //         format:'pem'
                //     }
                // })
                const privateKey=crypto.randomBytes(64).toString('hex')
                const publicKey=crypto.randomBytes(64).toString('hex')

                // public key cryptography standards !

                console.log({privateKey,publicKey}) // save collection KeyStore
                const keyStore = await keyTokenService.createKeyToken({
                    userId:newShop._id,
                    publicKey,
                    privateKey // lưu vào hàm createKeyToken
                })

                if(!keyStore)
                {
                    return {
                        code :'xxxx',
                        message:'keyStore error'
                    }
                }
                //const publickeyObject = crypto.createPublicKey(publicKeyString)
                //create token pair 
                const token = await createTokenPair({UserId:newShop._id,email},publicKey,privateKey)
                console.log('Createtoken Success  ',token)
                return {
                    code :201,
                    metaData:{
                        shop:getInfoData({fileds:['_id','name','email'],object:newShop}),
                        token
                    }
                }
            }
        // } catch (error) {
        //     return {
        //         code: '201',
        //         message:error.message,
        //         status:'error'
        //     }
        // }
    }
}

module.exports=AccessService