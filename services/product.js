const Product = require('../models/product');

function getAll() {
  return Product.find();
}

module.exports = {
  getAll,
};
