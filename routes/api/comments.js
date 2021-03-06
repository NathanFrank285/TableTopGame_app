const express = require('express')
const app = require('../../app');
const commentsRouter = express.Router();
const { csrfProtection, asyncHandler } = require('../../utils');
const { loginUser, logoutUser, requireAuth, restoreUser } = require('../../auth');
const { User, Story, Comment, Like } = require('../../db/models')
const { check, validationResult } = require('express-validator');


commentsRouter.use(requireAuth)

// commentsRouter.get('/', asyncHandler(async (req, res) => {
//     res.json('Here is your api comments get')
// }));

commentsRouter.post('/', asyncHandler(async (req, res, next) => {
    const { commentBody, storyId } = req.body
    const userId = req.session.auth.userId
    const comment = await Comment.create({
        body: commentBody,
        userId,
        storyId
    })
    const user = await User.findByPk(comment.userId)

    res.json({ comment, user })
}))

commentsRouter.delete('/:id', asyncHandler(async (req, res, next) =>{
  const id = req.params.id;
  const comment = await Comment.findByPk(id);

  
  if (req.session.auth.userId !== comment.userId) {
    const errors = new Error("Unauthorized");
    errors.status = 401;
    errors.message = "You are not authorized to delete this comment.";
    errors.title = "Unauthorized";
    console.log(errors);
    // res.json({errors})
  }
  await Like.destroy({
    where: { likeableId: comment.id, likeableType: "comment" },
  });

  await comment.destroy();
  res.json({});
  //   res.json('you can delete this tweet')
}))



module.exports = commentsRouter
