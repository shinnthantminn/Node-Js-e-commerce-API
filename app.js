require("dotenv").config();
const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  server = require("http").createServer(app),
  io = require("socket.io")(server),
  helper = require("./middleware/helper"),
  fileUpload = require("express-fileupload");

app.use(express.json());
app.use(fileUpload());

mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);

const permitRouter = require("./routers/permitRouter");
const roleRouter = require("./routers/roleRouter");
const userRouter = require("./routers/userRouter");
const categoryRouter = require("./routers/categoryRouter");
const subCategoryRouter = require("./routers/SubCategoryRouter");
const childCategoryRouter = require("./routers/childCategoryRouter");
const tagRouter = require("./routers/tagsRouter");
const deliveryRouter = require("./routers/DeliveryRouter");
const warrantyRouter = require("./routers/warrantyRouter");
const productRouter = require("./routers/productRouter");
const orderRouter = require("./routers/orderRouter");

app.use("/permit", permitRouter);
app.use("/role", roleRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/subCategory", subCategoryRouter);
app.use("/childCategory", childCategoryRouter);
app.use("/tag", tagRouter);
app.use("/delivery", deliveryRouter);
app.use("/warranty", warrantyRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);

const migration = require("./Migration/migrator");

(async () => {
  // migration.migrator();
  // migration.backupData();
})();

io.of("/chat")
  .use(async (socket, next) => {
    const token = socket.handshake.query.token;
    if (token) {
      try {
        const data = await helper.verify(token);
        const user = await helper.get(data._id);
        socket.user = JSON.parse(user);
        next();
      } catch (e) {
        next(new Error(e.message));
      }
    } else {
      next(new Error("you have no tokenization"));
    }
  })
  .on("connection", (socket) => {
    require("./middleware/chat").initialize(io, socket);
  });

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

server.listen(process.env.PORT, () => {
  console.log(`server running from http:127.0.0.1:${process.env.PORT}`);
});
