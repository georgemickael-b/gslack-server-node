const Joi = require('joi');

module.exports = {
  createMessageValidation: {
    body: Joi.object({
      message: Joi.string().required(),
      recipient: Joi.any(),
      recipientGroup: Joi.any(),
      parentMessage: Joi.any(),
    }).or('recipient', 'recipientGroup', 'parentMessage')
  },
  getMessagesValidation: {
    query: Joi.object({
      sender: Joi.any(),
      group: Joi.any(),
      parentMessage: Joi.any()
    }).or('sender', 'group', 'parentMessage')
  }
}