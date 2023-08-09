const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { findByUserId } = require('../services/KeyToken.service')

const HEADER={
    API_KEY:'x-api-key'
    ,AUTHORIZATION:'authorization',
    CLIENT_ID:'x-client-id'
}
const createTokenPair= async(payload ,publicKey,privateKey) =>{
    try {
        const accessToken = await JWT.sign(payload,publicKey,{
            expiresIn:'2 days'
        })

        const refreshToken = await JWT.sign(payload,privateKey,{
            expiresIn:'2 days'
        })

        JWT.verify(accessToken,publicKey,(err,decode)=>{
            if(err)
            {
                console.error('error verify::',err)
            }
            else
            {
                console.log('decode verify::' ,decode)
            }
        })
        return {accessToken,refreshToken}
    } catch (error) {
        return error
    }
}
/*  ----- authentication---------
    1- kiểm tra userId có missing ?
    2- get accestoken
    3- verifytoken 
    4- check user in dbs
    5- check keyStore with this userId
    6 if OKall -> return next
*/
const authentication = asyncHandler( async(req,res,next) =>{
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invalid Request')

    const keyStore = await findByUserId( {userId} )
    if(!keyStore) throw new NotFoundError('Not Found keystore')

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError("Invalid Request")

    try {
        const decodeUser = JWT.verify(accessToken,keyStore.publicKey)
        if(userId != decodeUser.UserId) throw new AuthFailureError("Invalid UserId")
        req.keyStore=keyStore
        return next()

    } catch (error) {
        throw error
    }
})

const verifyJWT = async (token , keySecret) =>{
    return await JWT.verify(token,keySecret)
}
module.exports={
    createTokenPair,
    authentication,
    verifyJWT
}