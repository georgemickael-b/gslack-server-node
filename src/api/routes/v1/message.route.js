const express = require('express');
const messageController = require('../../controllers/message.controller');
const { authorize } = require('../../middlewares/auth');
const { createMessageValidation, getMessagesValidation } = require('../../validations/message.validation');
const router = express.Router();
const validate = require('express-validation');


router.route('/')
    .post(authorize('user'), validate(createMessageValidation), messageController.create)
    .get(authorize('user'), validate(getMessagesValidation), messageController.getMessages)

router.route('/threads')
    .get(authorize('user'), messageController.getThreads)

module.exports = router;
