
const { SuccessResponse } = require('../core/success.response')
const {createComment, getCommentsByParentId}= require('../services/comment.service')


class CommentController {
    createComment =async (req,res,next)=>{
        new SuccessResponse({
            message:'Create new comment',
            metadata: await createComment(req.body)
        }).send(res)
    }

    getCommentByParentId =async (req,res,next)=>{
        new SuccessResponse({
            message:'Get list success',
            metadata: await getCommentsByParentId(req.query)
        }).send(res)
    }
}

module.exports = new CommentController()