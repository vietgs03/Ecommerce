const express =require('express')
const CommentController =require('../../controller/comment.controller')
const route= express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');



//authentication///
route.use(authenticationV2)
///////////

route.post('',asyncHandler(CommentController.createComment))
route.get('',asyncHandler(CommentController.getCommentByParentId))

module.exports=route