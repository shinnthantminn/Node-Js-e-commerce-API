const helper = require("./helper");
const { messageDB, unreadDB } = require("../models");

const isOnline = async (socketId, user) => {
  user["socketId"] = socketId;
  helper.set(socketId, user._id);
  helper.set(user._id, user);
};

const unReadMessage = async (socket) => {
  const item = await unreadDB.find({ to: socket.userId });
  if (item.length > 0) {
    item.forEach(async (i) => {
      await unreadDB.findByIdAndDelete(i._id);
    });
  }
  socket.emit("unreads", { msg: item.length });
};

const upMessage = async (io, socket, data) => {
  const message = await new messageDB(data).save();
  const messageGet = await messageDB
    .findById(message._id)
    .populate("from to", "name _id");
  const live = await helper.get(messageGet.to._id);
  if (live) {
    const item = JSON.parse(live);
    const socketTo = io.of("/chat").to(item.socketId);
    if (socketTo) {
      socketTo.emit("send", messageGet);
    } else socket.emit("send", "socket error");
  } else {
    const data = {
      from: messageGet.from._id,
      to: messageGet.to._id,
    };
    await new unreadDB(data).save();
  }
  socket.emit("send", messageGet);
};

const loadMore = async (socket, obj) => {
  const limit = +process.env.MSG_LIMIT;
  const page = obj.page === 1 ? 0 : obj.page - 1;
  const skipCount = page * limit;
  console.log(page);
  const data = await messageDB
    .find({
      $or: [{ form: socket.userId }, { to: socket.userId }],
    })
    .sort({ created: -1 })
    .skip(skipCount)
    .limit(limit)
    .populate("from to", "name _id");
  socket.emit("loadMore", data);
};

module.exports = {
  initialize: async (io, socket) => {
    socket.userId = socket.user._id;
    await isOnline(socket.id, socket.user);
    socket.on("send", (data) => {
      upMessage(io, socket, data);
    });
    await unReadMessage(socket);
    socket.on("load-more", (obj) => loadMore(socket, obj));
  },
};
