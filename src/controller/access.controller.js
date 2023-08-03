const AccessService = require("../services/access.service");
const {OK,CREATED}  = require("../core/success.response")
class AccessController {
    signUp = async (req,res,next)=>{

        new CREATED({
            message:'Registed',
            metadata :await AccessService.signUp(req.body)
        }).send(res)
 
    }
}

module.exports= new AccessController();