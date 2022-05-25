require("dotenv").config();
const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  fileUpload = require("express-fileupload");

app.use(express.json());
app.use(fileUpload());

mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);

const permitRouter = require("./routers/permitRouter");
const roleRouter = require("./routers/roleRouter");
const userRouter = require("./routers/userRouter");

app.use("/permit", permitRouter);
app.use("/role", roleRouter);
app.use("/user", userRouter);

const migration = require("./Migration/migrator");

(async () => {
  // migration.migrator();
  // migration.backupData();
})();

app.get("*", (req, res, next) => {
  res.status(400).send("get method error");
});

app.use((err, req, res, next) => {
  err.status = err.status || 200;
  res.status(err.status).json({
    con: false,
    msg: err.message,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`server running from http:127.0.0.1:${process.env.PORT}`);
});
