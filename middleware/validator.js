const helper = require("../middleware/helper");

module.exports = {
  validBody: (schema) => {
    return async (req, res, next) => {
      const result = await schema.validate(req.body);
      if (result.error) {
        next(new Error(res.error.details[0].message));
      } else next();
    };
  },
  validUnique: (db, ...name) => {
    return async (req, res, next) => {
      const num = [];
      for (const x of name) {
        const obj = {};
        obj[name] = req.body[name];
        const finder = await db.findOne(obj);
        num.push(x);
        if (finder) {
          next(new Error(`this ${name} was existing in our server`));
        } else if (num.length === name.length) {
          next();
        }
      }
    };
  },
  validParams: (schema, name) => {
    return async (req, res, next) => {
      const obj = {};
      obj[name] = req.params[name];
      const result = await schema.validate(obj);
      if (result.error) {
        next(new Error(result.error.details[0].message));
      } else next();
    };
  },
  validToken: () => {
    return async (req, res, next) => {
      if (req.headers.authorization) {
        try {
          const token = req.headers.authorization.split(" ")[1];
          const data = await helper.verify(token);
          const user = await helper.get(data._id);
          req.user = JSON.parse(user);
          next();
        } catch (e) {
          next(new Error(e.message));
        }
      } else next(new Error("tokenization error"));
    };
  },
  validRole: (...role) => {
    return (req, res, next) => {
      const item = req.user.role.map((i) => i.name);
      const finder = role.some((i) => item.includes(i));
      if (finder) {
        next();
      } else next(new Error("you have no permit"));
    };
  },
};
