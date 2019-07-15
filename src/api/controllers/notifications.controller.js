const httpStatus = require('http-status');
const Notifications = require('../models/notification.model');
let socketStore = require('../socket/socket')
let SOCKET_KEYS = require('../utils/socketKeys')

exports.getAllNotications = async (req, res, next) => {
    try {
        const user = req.user.id;
        let notifications = await Notifications.getAllNotications({ ...req.query, user });
        res.status(httpStatus.OK).json(notifications);
    } catch (error) {
        next(error);
    }
}

exports.clearUnRead = async (req, res, next) => {
    try {
        const recipient = req.user.id;
        console.log(req.body, "kkj")
        let notification = await Notifications.clearUnRead({ ...req.body, recipient });
        console.log("notification", notification)
        if (socketStore.sockets[recipient]) {
            socketStore.sockets[recipient].emit(SOCKET_KEYS.NOTIFICATION_NEW_MESSAGE, notification);
        }
        res.status(httpStatus.OK).json(notification);
    } catch (error) {
        next(error);
    }
};

