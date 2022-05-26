const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("async-redis").createClient();

module.exports = {
  fMsg: (res, status, msg = "", result = []) => {
    res.status(status).json({
      con: true,
      msg,
      result,
    });
  },
  encode: (payload) => bcrypt.hashSync(payload, 10),
  compare: (plane, hash) => bcrypt.compare(plane, hash),
  token: (payload) =>
    jwt.sign(payload, process.env.KEY, {
      expiresIn: "1h",
    }),
  verify: (payload) =>
    jwt.verify(payload, process.env.KEY, (err, data) => {
      if (err) {
        throw Error(err.message);
      }
      return data;
    }),
  set: (key, value) => redis.set(key.toString(), JSON.stringify(value)),
  get: (key) => redis.get(key.toString()),
  del: (key) => redis.del(key.toString()),
};
