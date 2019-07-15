const mongoose = require('mongoose');
const Schema = mongoose.Schema
const APIError = require('../utils/APIError');

const messageSchema = new Schema({
    message: {
        type: 'String',
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parentMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    },
    recipientGroup: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    },
    readBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})
messageSchema.set('timestamps', true);
messageSchema.statics = {
    async createMessage({ creator, message, parentMessage, recipient, recipientGroup }) {
        console.log("here")
        try {
            let messageObj = new Message({ creator, message, parentMessage, recipient, recipientGroup })
            messageObj.populate("creator").execPopulate();
            return messageObj.save()
        } catch (err) {
            throw new APIError(err);
        }
    },
    async getUnreadCount({ sender, group, recipient }) {
        try {
            let options = {}
            if (group) {
                options = { recipientGroup: group, readBy: { "$ne": recipient } }
            }
            else if (sender) {
                options = { creator: sender, recipient: recipient, recipientGroup: null, readBy: { "$ne": recipient } }
            }
            console.log(options)
            return this.countDocuments(options)
        } catch (err) {
            throw new APIError(err);
        }
    },
    async getMessages({ skip = 0, perPage = 20, sender, group, recipient, parentMessage }) {
        console.log(sender)
        try {
            let messageConditions = {}


            if (parentMessage) {
                messageConditions = {
                    parentMessage: parentMessage
                }
            }
            else if (sender)
                messageConditions = {
                    $or: [
                        {
                            $and: [
                                { creator: sender },
                                { recipient: recipient }
                            ]
                        },
                        {
                            $and: [
                                { recipient: sender },
                                { creator: recipient }
                            ]
                        }
                    ],
                    recipientGroup: null
                }

            else if (group) {
                messageConditions = {
                    recipientGroup: group
                }
            }
            return this.find(messageConditions)
                .sort({ createdAt: -1 })
                .skip(Number(skip))
                .limit(Number(perPage))
                .populate('creator', 'email name')
                .populate({
                    path: 'parentMessage',
                    populate: { path: 'creator', select: 'email name' }
                })
                .exec()
        } catch (err) {
            throw new APIError(err);
        }
    },

    async getThreadParentMessages({ recipient }) {
        let parentIds = await this.distinct("parentMessage", {
            $or: [{
                creator: recipient
            }, {
                recipient: recipient
            }]
        })

        return this.find({
            '_id': { $in: parentIds }
        }).populate('creator')
    }
}
const Message = mongoose.model('Message', messageSchema);
module.exports = Message