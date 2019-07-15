const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const messageRoutes = require('./message.route');
const groupRoutes = require('./group.route');
const notificationsRoutes = require('./notifications.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/users', userRoutes);
router.use('/messages', messageRoutes);
router.use('/groups', groupRoutes);
router.use('/auth', authRoutes);
router.use('/notifications', notificationsRoutes);


module.exports = router;
