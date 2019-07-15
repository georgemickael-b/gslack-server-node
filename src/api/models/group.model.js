const mongoose = require('mongoose');
const Schema = mongoose.Schema

const groupSchema = new Schema({
    name: 'String',
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})
groupSchema.set('timestamps', true);

groupSchema.statics = {
    async get(id) {
        try {
            let group;
            if (mongoose.Types.ObjectId.isValid(id)) {
                group = await this.findById(id).exec();
                console.log(group)
            }
            if (group) {
                return group;
            }

            throw new APIError({
                message: 'Group does not exist',
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    },
    async getGroupsOfUser({ user }) {
        try {
            let options = {}
            if (user)
                options = { members: user }
            console.log(user)
            return this.find(options);

        } catch (error) {
            throw error;
        }
    },
    async createGroup({ name, members, creator }) {
        try {
            return this.create({ name, members, creator })
        } catch (error) {
            throw error
        }
    }
}

module.exports = mongoose.model('Group', groupSchema);
