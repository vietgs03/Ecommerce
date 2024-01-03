'use strict'

const { NotFoundError } = require('../core/error.response')
const Comment = require('../models/comment.model')
const { convertToObjectIdMongoDb } = require('../utils')

// key feature :comment service
// + add comment {user| shop}
// + get a list of comment 
class CommentService{

    static async createComment({
        productId,userId,content,parentCommentId = null,
    })
    {
        const comment = new Comment({
            comment_productId:productId,
            comment_userId:userId,
            comment_content:content,
            comment_parentId:parentCommentId
        })

        let rightValue
        if(parentCommentId){
            //reply comment
            const parentComment = await Comment.findById(parentCommentId)
            if(!parentComment) throw new NotFoundError("comment error" , parentCommentId)

            rightValue = parentComment.comment_right
            // update Many comment 
            await Comment.updateMany({
                comment_productId:productId,
                comment_right:{$gte:rightValue}
            },{
                $inc:{comment_right:2}
            })

            // update Many comment 
            await Comment.updateMany({
                comment_productId:productId,
                comment_left:{$gt:rightValue}
            },{
                $inc:{comment_left:2}
            })
        }
        else{
            const maxRightValue = await Comment.findOne({
                comment_productId:productId,
            },'comment_right',{sort:{comment_right:-1}})
            if(maxRightValue)
            {
                rightValue = maxRightValue.right+1
            }else{
                rightValue = 1
            }
        }

        // insert comment
        comment.comment_left = rightValue
        comment.comment_right = rightValue+1

        await comment.save()
        return comment
    }

    static async getCommentsByParentId({
        productId,parentCommentId=null,limit=50,offset=0 // skip
    })
    {
        if(parentCommentId)
        {
            const parent = await Comment.findById(parentCommentId)
            if(!parent) throw new NotFoundError("Not found comment for product")

            const comments = await Comment.find({
                comment_productId:productId,
                comment_left:{$gt:parent.comment_left},
                comment_right:{$lte:parent.comment_right},
            }).select({
                comment_left:1,
                comment_right:1,
                comment_content:1,
                comment_parentId:1
            }).sort({
                comment_left:1
            })
            return comments
        }
        const comments = await Comment.find({
            comment_productId:productId,
            comment_parentId:parentCommentId
        }).select({
            comment_left:1,
            comment_right:1,
            comment_content:1,
            comment_parentId:1
        }).sort({
            comment_left:1
        })

        return comments
    }
}

module.exports=CommentService