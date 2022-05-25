const joi = require("joi");

module.exports = {
  joiBody: {
    permit: {
      body: joi.object({
        name: joi.string().min(2).required(),
      }),
      patch: joi.object({
        name: joi.string().min(2),
      }),
    },
    role: {
      body: joi.object({
        name: joi.string().min(2).required(),
      }),
      patch: joi.object({
        name: joi.string().min(2),
      }),
      permit: joi.object({
        roleId: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        permitId: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
      }),
    },
    user: {
      body: joi.object({
        name: joi.string().min(2).required(),
        password: joi.string().min(2).required(),
        email: joi.string().email().required(),
      }),
      patch: joi.object({
        name: joi.string().min(2),
        password: joi.string().min(2),
        email: joi.string().email(),
      }),
      login: joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(2).required(),
      }),
      Role: joi.object({
        roleId: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        userId: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
      }),
      permit: joi.object({
        permitId: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        userId: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
      }),
    },
  },
  joiParams: {
    id: joi.object({
      id: joi
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  },
};
