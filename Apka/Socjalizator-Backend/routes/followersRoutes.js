const express = require('express');

const router = express.Router();

const FollowerController = require('..//controllers/followers');
const AuthHelper = require('..//helpers/AuthHelper');

router.post('/follow-user', AuthHelper.VerifyToken, FollowerController.FollowUser);
router.post('/unfollow-user', AuthHelper.VerifyToken, FollowerController.UnfollowUser);
router.post('/mark/:id', AuthHelper.VerifyToken, FollowerController.MarkNotification);
router.post('/mark-all', AuthHelper.VerifyToken, FollowerController.MarkAllNotifications);

module.exports = router;