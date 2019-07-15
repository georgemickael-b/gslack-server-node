const express = require('express');
const notificationsController = require('../../controllers/notifications.controller');
const { authorize } = require('../../middlewares/auth');
const router = express.Router();

router.route('/')
    .get(authorize('user'), notificationsController.getAllNotications)

router.route('/clear-unread')
    .put(authorize('user'), notificationsController.clearUnRead)

module.exports = router;
