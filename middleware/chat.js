const helper = require("./helper");
const { messageDB, unreadDB } = require("../models");

const isOnline = async (socketId, user) => {
  user.socketId = socketId;
  helper.set(socketId, user._id);
  helper.set(user._id, user);
};

const upMessage = async (io, socket, data) => {
  const message = await new messageDB(data).save();
  const messageGet = await messageDB
    .findById(message._id)
    .populate("from to", "name _id");
  const live = await helper.get(messageGet.to._id);
  console.log(live);
};

module.exports = {
  initialize: async (io, socket) => {
    socket.userId = socket.user._id;
    await isOnline(socket.id, socket.user);
    socket.on("message", (data) => {
      upMessage(io, socket, data);
    });
  },
};
