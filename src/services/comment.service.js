'use strict'

const { NotFoundError } = require('../core/error.response')
const Comment = require('../models/comment.model')
const { convertToObjectIdMongoDb } = require('../utils')
const {findProduct} = require('../models/repositories/product.repo')
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

    static async deleteComment({commentId,productId})
    {
        //check product exits 
        const foundProduct = await findProduct({
            product_id:productId,unSelect:['__v','product_variation']
        })
        if(!foundProduct) throw new NotFoundError('product not found')

        // 1 . xac dinh gia tri left va right cua comment cha
        const comment = await Comment.findById(commentId)
        if(!comment) throw new NotFoundError('comment not found')

        const left_value  = comment.comment_left
        const right_value = comment.comment_right

        // 2 tinh width
        const width = right_value-left_value +1
        // 3 xoa tat ca commentid con

        await Comment.deleteMany({
            comment_productId:productId,
            comment_content:{$gte:left_value,$lte:right_value}
        })
        // 4 step cap nhap lai gia tri left va right con lai

        await Comment.updateMany({
            comment_productId:productId,
            comment_right:{$gt:right_value}
        },{
            $inc:{comment_right:-width}
        })

        await Comment.updateMany({
            comment_productId:productId,
            comment_left:{$gt:right_value}
        },{
            $inc:{comment_left:-width}
        })

        return true
    }
}

module.exports=CommentService