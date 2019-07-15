const express = require('express');
const groupController = require('../../controllers/group.controller');
const { authorize } = require('../../middlewares/auth');
const router = express.Router();
const validate = require('express-validation');


router.route('/')
    .post(authorize('user'), groupController.create)
    .get(authorize('user'), groupController.get)
module.exports = router;
