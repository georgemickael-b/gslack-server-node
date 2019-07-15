const mongoose = require('mongoose');
const Schema = mongoose.Schema
const Group = require('./group.model')

const notificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    from: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    fromModel: {
        type: String,
        required: true,
        enum: ['User', 'Group']
    },
    unRead: { type: Number, default: 0 }
})
notificationSchema.set('timestamps', true);

notificationSchema.statics = {
    async get(user) {
        try {
            return this.find({ user: user })

        } catch (error) {
            throw error;
        }
    },
    async getAllNotications({ user }) {
        console.log("user", user)
        try {
            return await Notification.find({
                user: user
            })
        }
        catch (error) {
            throw error;
        }
    },
    async clearUnRead({ creator, recipient, group }) {
        if (creator)
            return this.findOneAndUpdate({ user: recipient, from: creator, fromModel: 'User' }, { unRead: 0 }, { new: true })
        else if (group)
            return this.findOneAndUpdate({ user: recipient, from: group, fromModel: 'Group' }, { unRead: 0 }, { new: true })

    },
    async incUnRead({ creator, recipient, recipientGroup }) {
        try {
            if (recipient)
                return this.findOneAndUpdate({ user: recipient, from: creator, fromModel: 'User' }, { $inc: { unRead: 1 } }, { new: true, upsert: true })
            else if (recipientGroup) {
                let group = await Group.findById(recipientGroup)
                let members = group.members
                console.log(members)

                var bulk = Notification.collection.initializeOrderedBulkOp();
                for (let member of members) {
                    bulk.find({ user: member, from: mongoose.Types.ObjectId(recipientGroup), fromModel: 'Group' }).upsert().update({ $inc: { unRead: 1 } });
                }
                let res = await bulk.execute()
                console.log(res)
                let memberIds = members.map((m) => mongoose.Types.ObjectId(m))
                console.log(memberIds)
                let notifications = await Notification.find({
                    user: {
                        $in: memberIds
                    }
                }).populate("from")
                notifications = notifications.filter((n) => n.from == recipientGroup)
                return Promise.resolve(notifications)
            }
        }
        catch (error) {
            throw error;
        }
    }
}

let Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification
