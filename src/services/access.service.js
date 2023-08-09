// chỉ làm viec với service và model nên viết static cho lẹ
const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const keyTokenService = require("./KeyToken.service")
const {createTokenPair, verifyJWT} = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequest,ConflictRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response")
const { findByEmail } = require("./shop.service")
const { verify } = require("crypto")
const RoleShop = {
    SHOP:'SHOP',
    WRITER:'WRITER',
    EDITOR:'EDITOR',
    ADMIN:'ADMIN'
}
class AccessService
{


    /*
        check this token used?
    */
    static handlerRefreshToken = async(refreshToken)=>{
        const foundToken = await keyTokenService.findByRefreshTokenUsed(refreshToken)
        if(foundToken)
        {
            // decode xem nó là ai có trong hệ thống k
            const {userId,email} = await verifyJWT(refreshToken,foundToken.privateKey)
            console.log({userId,email})
            await keyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happen !! plz relogin')

        }
        const holdToken = await keyTokenService.findByRefreshToken(refreshToken)
        if(!holdToken) throw new AuthFailureError("Shop is not registed")

        // verify token
        const {userId,email} = await verifyJWT(refreshToken,holdToken.privateKey)
        console.log('[2]--',{userId,email})
        //check userid 
        const foundShop = await findByEmail({email})
        if(!foundShop) throw new AuthFailureError("Shop is not registed")

        const token = await createTokenPair({UserId:foundShop._id,email},holdToken.publicKey,holdToken.privateKey)
        await holdToken.updateOne({
            $set:{
                refreshToken:token.refreshToken
            }
            ,$addToSet:{
                refreshTokenUsed:refreshToken // da dc su dung de lay token moi roi 
            }
        })
        return {
            user:{userId,email},
            token
        }
    }
    static logout = async(keyStore)=>
    {   
        const delKey = await keyTokenService.removeKeybyId(keyStore._id)
        console.log({delKey})
        return delKey
    }
    // - check mail in dbs 
    // - match password
    // - create AT vs RT and save   access token vs refresh token 
    // - generate token 
    // - get Data return login
    static login = async ({email,password,refreshToken=null})=>{
        // check email 
        const foundShop = await findByEmail({email})
        if(!foundShop) throw new BadRequest("Error : shop not registered")
        //match password
        const match = bcrypt.compare(password,foundShop.password)
        if(!match) throw new AuthFailureError("Authentication error ")
        // create token 
        const privateKey=crypto.randomBytes(64).toString('hex')
        const publicKey=crypto.randomBytes(64).toString('hex')
        
        const token = await createTokenPair({UserId:foundShop._id,email},publicKey,privateKey)
        await keyTokenService.createKeyToken({
            userId:foundShop._id,
            refreshToken:token.refreshToken,
            privateKey,publicKey
        })        
        return {
            shop:getInfoData({filed:['_id','name','email'],object:foundShop}),
            token
        }
    }
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
                        shop:getInfoData({filed:['_id','name','email'],object:newShop}),
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