const helper = require("../middleware/helper");
const { orderDB, orderItemDB, productDB } = require("../models");

module.exports = {
  all: async (req, res, next) => {
    if (req.params.page > 0) {
      const page = +req.params.page;
      const limit = +process.env.POINT;
      const reqPage = page === 1 ? 0 : page - 1;
      const skipCount = limit + reqPage;
      const result = await orderDB
        .find()
        .skip(skipCount)
        .limit(limit)
        .populate("item user");
      helper.fMsg(res, 200, `all order form page ${page}`, result);
    } else next(new Error("no page found"));
  },
  add: async (req, res, next) => {
    const items = req.body;
    let total = 0;
    const saveItem = await new orderDB();
    const orderItems = [];
    for (x of items) {
      const product = await productDB.findById(x.id);
      const orderItemObj = {
        order: saveItem._id,
        count: x.count,
        productId: product._id,
        name: product.name,
        price: product.price,
      };
      orderItems.push(orderItemObj);
      total += x.count * product.price;
    }
    console.log(orderItems);
    const orderItem = await orderItemDB.insertMany(orderItems);

    saveItem.user = req.user;
    saveItem.item = orderItem.map((i) => i._id);
    saveItem.count = orderItem.length;
    saveItem.total = total;
    const result = await saveItem.save();
    helper.fMsg(res, 201, "order upload complete", result);
  },
  get: async (req, res, next) => {
    const result = await orderDB
      .find({ user: req.user._id })
      .populate("item user");
    helper.fMsg(res, 200, "that is your order", result);
  },
};

/*insertMany ဆိုတာကတော့ အများကြီးကို DB ထဲမှာထည့်လို့ရအောင်လုပ်လိုက်တာ ပါ ဉပမာ Scheam ပါပြီးသာကို save နဲ့ Schema format မကြတဲ့
တန်ဖိုးတွေကိုထည့်လို့မရပါဘူး insertMany နဲ့ဆိုရပါတယ်
* */
