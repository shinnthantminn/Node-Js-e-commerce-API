const joi = require("joi");
const { optional } = require("joi");

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
    category: {
      body: joi.object({
        name: joi.string().min(2).required(),
        image: joi.string().min(2).required(),
      }),
      patch: joi.object({
        name: joi.string().min(2),
        image: joi.string().min(2),
      }),
    },
    subCategory: {
      body: joi.object({
        name: joi.string().min(2).required(),
        image: joi.string().min(2).required(),
        category: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
      }),
      patch: joi.object({
        name: joi.string().min(2),
        image: joi.string().min(2),
        category: joi.string().regex(/^[0-9a-fA-F]{24}$/),
      }),
    },
    childCategory: {
      body: joi.object({
        name: joi.string().min(2).required(),
        image: joi.string().min(2).required(),
        subCategory: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
      }),
      patch: joi.object({
        name: joi.string().min(2),
        image: joi.string().min(2),
        subCategory: joi.string().regex(/^[0-9a-fA-F]{24}$/),
      }),
    },
    tag: {
      body: joi.object({
        name: joi.string().min(2).required(),
        image: joi.string().min(2).required(),
      }),
      patch: joi.object({
        name: joi.string().min(2),
        image: joi.string().min(2),
      }),
    },
    delivery: {
      body: joi.object({
        name: joi.string().min(2).required(),
        image: joi.string().min(2).required(),
        price: joi.number().required(),
        duration: joi.string().required(),
        remark: joi.optional(),
      }),
      patch: joi.object({
        name: joi.string().min(2),
        image: joi.string().min(2),
        price: joi.number(),
        duration: joi.string(),
        remark: joi.optional(),
      }),
    },
    warranty: {
      body: joi.object({
        name: joi.string().min(2).required(),
        image: joi.string().required(),
        remark: joi.optional(),
      }),
      patch: joi.object({
        name: joi.string().min(2),
        image: joi.string(),
        remark: joi.optional(),
      }),
    },
    product: {
      body: joi.object({
        name: joi.string().min(2).required(),
        price: joi.number().required(),
        brand: joi.string().min(2).required(),
        category: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        subCategory: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        childCategory: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        tag: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        features: joi.array().required(),
        desc: joi.string().min(2).required(),
        detail: joi.string().min(2).required(),
        colors: joi.array().required(),
        sizes: joi.array().required(),
        images: joi.string().min(2).required(),
      }),
      patch: joi.object({
        name: joi.string().min(2),
        price: joi.number(),
        brand: joi.string().min(2),
        category: joi.string().regex(/^[0-9a-fA-F]{24}$/),
        subCategory: joi.string().regex(/^[0-9a-fA-F]{24}$/),
        childCategory: joi.string().regex(/^[0-9a-fA-F]{24}$/),
        tag: joi.string().regex(/^[0-9a-fA-F]{24}$/),
        discount: joi.optional(),
        features: joi.array(),
        desc: joi.string().min(2),
        detail: joi.string().min(2),
        status: joi.optional(),
        colors: joi.array(),
        sizes: joi.array(),
        rating: joi.optional(),
        images: joi.string().min(2),
      }),
      delivery: joi.object({
        deliveryId: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        productId: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
      }),
      warranty: joi.object({
        warrantyId: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        productId: joi
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
