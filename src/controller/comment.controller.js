
const { SuccessResponse } = require('../core/success.response')
const {createComment, getCommentsByParentId,deleteComment}= require('../services/comment.service')


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

    deleteComment =async (req,res,next)=>{
        new SuccessResponse({
            message:'deleteComment',
            metadata: await deleteComment(req.body)
        }).send(res)
    }
}

module.exports = new CommentController()