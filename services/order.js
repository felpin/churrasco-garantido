const companyService = require('./company');
const productService = require('./product');
const InexistentCnpjError = require('../errors/inexistentCnpjError');
const InexistentOrderError = require('../errors/inexistentOrderError');
const InexistentProductError = require('../errors/inexistentProductError');
const Order = require('../models/order');

/**
 * A product in an order
 * @typedef {Object} Product
 * @param {string} name The name of the product
 * @param {number} quantity The quantity to be included in the order
 */

/**
 * Creates an order
 * @param {string} userId The user's id
 * @param {string} cnpj The CNPJ of the company (without separators)
 * @param {Product} products The products in the order
 */
function create(userId, cnpj, products) {
  return new Promise((resolve, reject) => {
    companyService
      .isCnpjUniqueToUser(userId, cnpj)
      .then((doesCnpjInexist) => {
        if (doesCnpjInexist) {
          reject(new InexistentCnpjError(cnpj));
          return;
        }

        const productNames = products.map(({ name }) => name);
        const existResponse = productService.exists(productNames);
        if (!existResponse.exists) {
          reject(new InexistentProductError(existResponse.inexistentProduct));
          return;
        }

        nextOrderCode()
          .then((code) => {
            const newOrder = new Order({
              _id: code,
              cnpj,
              products,
              user: userId,
            });

            return newOrder
              .save()
              .then(() => resolve());
          })
          .catch(error => reject(error));
      })
      .catch(error => reject(error));
  });
}

/**
 * Deletes an order
 * @param {string} userId The user's id
 * @param {string} code The code of the order
 * @returns {Promise} Resolved when the order is deleted
 */
function exclude(userId, code) {
  return new Promise((resolve, reject) => {
    Order
      .findOne({ _id: code, active: true, user: userId })
      .then((order) => {
        if (!order) {
          reject(new InexistentOrderError(code));
          return;
        }

        order.set({ active: false });

        order
          .save()
          .then(() => resolve())
          .catch(error => reject(error));
      })
      .catch(error => reject(error));
  });
}

/**
 * Get the next code
 * @returns {Promise<number>} The next order's code
 */
function nextOrderCode() {
  return new Promise((resolve, reject) => {
    Order
      .findOne()
      .sort('-_id')
      .then((orderWithHighestCode) => {
        if (!orderWithHighestCode) {
          const MIN_ORDER_CODE = 1;

          resolve(MIN_ORDER_CODE);
          return;
        }

        const nextCode = orderWithHighestCode._id + 1;
        resolve(nextCode);
      })
      .catch(error => reject(error));
  });
}

module.exports = {
  create,
  exclude,
};
