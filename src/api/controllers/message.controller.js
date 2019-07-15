const httpStatus = require('http-status');
const Message = require('../models/message.model');
const User = require('../models/user.model');
const Group = require('../models/group.model');
const Notifications = require('../models/notification.model')
let socketStore = require('../socket/socket')
let SOCKET_KEYS = require('../utils/socketKeys')

exports.create = async (req, res, next) => {
    try {
        const creator = req.user.id;
        const { recipient, recipientGroup } = req.body;
        console.log(recipient, recipientGroup)
        if (recipient)
            await User.get(recipient)
        else if (recipientGroup)
            await Group.get(recipientGroup)

        let message = new Message({ ...req.body, creator });
        let savedMessage = await Message.createMessage(message);

        let notifications = await Notifications.incUnRead({ recipient, recipientGroup, creator })
        if (!Array.isArray(notifications)) {
            notifications = [notifications]
        }

        if (recipient && socketStore.sockets[recipient]) {
            socketStore.sockets[recipient].emit(SOCKET_KEYS.MESSAGE_CREATED, savedMessage);
            socketStore.sockets[recipient].emit(SOCKET_KEYS.NOTIFICATION_NEW_MESSAGE, notifications[0]);
        }
        else if (recipientGroup) {
            notifications.forEach((n) => {
                if (n.user != creator && socketStore.sockets[n.user]) {
                    socketStore.sockets[n.user].emit(SOCKET_KEYS.NOTIFICATION_NEW_MESSAGE, n);
                }
            })
        }

        res.status(httpStatus.OK).json(savedMessage);
    } catch (error) {
        next(error);
    }
};

exports.getMessages = async (req, res, next) => {
    try {
        const recipient = req.user.id;
        let messages = await Message.getMessages({ ...req.query, recipient });
        messages = messages.reverse()
        let unreadCount = await Message.getUnreadCount({ ...req.query, recipient });
        res.status(httpStatus.OK).json({ messages, unreadCount });
    } catch (error) {
        next(error);
    }
};

exports.getThreads = async (req, res, next) => {
    try {
        const recipient = req.user.id;
        let messages = await Message.getThreadParentMessages({ ...req.query, recipient });
        res.status(httpStatus.OK).json(messages);
    } catch (error) {
        next(error);
    }
};

