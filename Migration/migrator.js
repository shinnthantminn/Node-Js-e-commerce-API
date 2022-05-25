const fs = require("fs");
const { userDB, permitDB, roleDB } = require("../models");
const helper = require("../middleware/helper");

const migrate = async (data, db, name) => {
  const file = JSON.parse(data);
  for (const x of file) {
    const obj = {};
    obj[name] = x[name];
    const finder = await db.findOne(obj);
    if (!finder) {
      try {
        if (x.password) {
          x.password = helper.encode(x.password);
        }
        await new db(x).save();
      } catch (e) {
        console.log(e.message);
      }
    }
  }
};

module.exports = {
  migrator: async () => {
    const roleData = fs.readFileSync("./Migration/data/roleData.json");
    const userData = fs.readFileSync("./Migration/data/userData.json");
    const permitData = fs.readFileSync("./Migration/data/permitData.json");
    await migrate(roleData, roleDB, "name");
    await migrate(userData, userDB, "email");
    await migrate(permitData, permitDB, "name");

    const user = await userDB.findOne({ name: "Shinn Thant Minn" });
    const roleId = await roleDB.findOne({ name: "Admin" });
    if (user && roleId) {
      const finder = user.role.find((i) => i.equals(roleId._id));
      if (finder) {
        return;
      }
      await userDB.findByIdAndUpdate(user._id, { $push: { role: roleId._id } });
    }
  },
  backupData: async () => {
    try {
      const data = await userDB.find();
      await fs.writeFile(
        "./Migration/backUp/userBackupData.json",
        JSON.stringify(data),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    } catch (e) {
      console.log(e);
    }
  },
};
