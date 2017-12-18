const mongoose = require('mongoose');

const productsInOrderSchema = mongoose.Schema({
  name: String,
  quantity: Number,
}, { _id: false });

const orderSchema = mongoose.Schema({
  _id: Number,
  cnpj: String,
  products: [productsInOrderSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;
