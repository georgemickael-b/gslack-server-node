const httpStatus = require('http-status');
const Group = require('../models/group.model');

exports.create = async (req, res, next) => {
    try {
        const creator = req.user.id;
        let group = await Group.createGroup({ ...req.body, creator });
        res.status(httpStatus.OK).json(group);
    } catch (error) {
        next(error);
    }
};


exports.get = async (req, res, next) => {
    try {
        const user = req.user.id;
        let group = await Group.getGroupsOfUser({ ...req.query, user });
        res.status(httpStatus.OK).json(group);
    } catch (error) {
        next(error);
    }
};

