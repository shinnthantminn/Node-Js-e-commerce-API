const { messageDB, unreadDB } = require("../models");
const helper = require("../middleware/helper");

const upComing = async (io, socket, data) => {
  const result = await new messageDB(data).save();
  const message = await messageDB
    .findById(result._id)
    .populate("from to", "name _id");
  const live = await helper.get(message.to._id);
  if (live) {
    const anotherUser = JSON.parse(live);
    const toSocket = await io.of("/chat").to(anotherUser.socketId);
    toSocket.emit("reply", message);
  } else {
    const data = {
      from: message.from._id,
      to: message.to._id,
    };
    await new unreadDB(data).save();
  }
  socket.emit("reply", message);
};

const isOnline = async (socketId, user) => {
  user.socketId = socketId;
  helper.set(socketId, user._id);
  helper.set(user._id, user);
};

const unReadMessage = async (socket) => {
  const finder = await unreadDB.find({ to: socket.user._id });
  if (finder.length > 0) {
    finder.forEach(async (i) => {
      await unreadDB.findByIdAndDelete(i._id);
    });
  }
  socket.emit("unread", { msg: finder.length });
};

const loadMoreMessage = async (socket, data) => {
  const page = Number(data.page);
  const limit = Number(process.env.MSG_LIMIT);
  const reqPage = page === 1 ? 0 : page - 1;
  const skip = limit * reqPage;
  const finder = await messageDB
    .find({
      $or: [{ from: socket.user._id }, { to: socket.user._id }],
    })
    .sort({ created: -1 })
    .skip(skip)
    .limit(limit)
    .populate("from to", "name _id");
  socket.emit("loadMore", finder);
};

module.exports = {
  initialize: async (io, socket) => {
    await isOnline(socket.id, socket.user);
    socket.on("send", (data) => upComing(io, socket, data));
    await unReadMessage(socket);
    socket.on("load-more", (data) => {
      loadMoreMessage(socket, data);
    });
  },
};
