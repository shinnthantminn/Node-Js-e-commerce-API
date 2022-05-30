const fs = require("fs");

module.exports = {
  image: (dir) => {
    return async (req, res, next) => {
      if (req.files) {
        const file = req.files.file;
        const name = new Date().valueOf() + file.name;
        if (!fs.existsSync(`./upload/${dir}`)) {
          await fs.mkdirSync(`./upload/${dir}`);
        }
        await file.mv(`./upload/${dir}/${name}`, (err) => {
          if (err) {
            throw new Error(err.message);
          }
        });
        req.body.image = name;
        next();
      } else if (req.method === "PATCH") {
        next();
      } else next(new Error("image was require"));
    };
  },
  images: (dir) => {
    return (req, res, next) => {
      if (req.files) {
        const image = [];
        req.files.files.map((i) => {
          const name = new Date().valueOf() + i.name;
          if (!fs.existsSync(`./upload/${dir}`)) {
            fs.mkdirSync(`./upload/${dir}`);
          }
          image.push(name);
          i.mv(`./upload/${dir}/${name}`);
        });
        req.body.images = image.join(",");
        next();
      } else if (req.method === "PATCH") {
        next();
      } else next(new Error("images was require"));
    };
  },
};
