const express = require('express');
const { locals } = require('../app');
const profileRouter = express.Router();
const { Story, Like, User } = require('../db/models');
const { asyncHandler } = require('../utils');

profileRouter.get(`/:id`, asyncHandler(async (req, res) => {
    const { id } = req.params

    const profileUser = await User.findByPk(id, {
        include: [
            {
                model: User,
                as: "following",
            },
            {
                model: User,
                as: "follower",
                // attributes: {
                //     exclude: ["hashedPassword"]
                // }
            },
            {
                model: Story,
            }
        ]
    })

    const followingArr = profileUser.following.map(obj => {
        return obj.id
    })
    console.log(profileUser.id, '********************************************************')
    let followData;
    let answer;

    if (req.session.auth) {
        const loggedinUser = req.session.auth.userId;


        if (followingArr.includes(loggedinUser)) {
            followData = "unfollow";
            answer = "true";
        } else {
            followData = "follow";
            answer = "false";
        }
    }

    console.log("==================================================================================", answer);
    // console.log(`user`)
    // res.json(user)
    res.render(`profile`, { profileUser, id, title: `Profile`, followData, answer })
}))



module.exports = profileRouter;
