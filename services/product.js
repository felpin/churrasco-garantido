const Product = require('../models/product');

/**
 * The response from the exists function
 * @typedef {Object} ExistsResponse
 * @param {boolean} exists If all the products exists
 * @param {string} inexistentProduct The inexistent product, if any
 */

/**
 * Check if one or more products exists
 * @param {string | string[]} products The product or an array of products to check if exists
 * @returns {ExistsResponse}
 */
function exists(products) {
  const allExistentProducts = getAll();
  const allExistentProductsSet = new Set(allExistentProducts);

  const productsCopy = [];
  if (typeof products === 'string') {
    productsCopy.push(products);
  } else if (Array.isArray(products)) {
    productsCopy.push(...products);
  }

  let productBeingChecked;
  const allProductsExists = productsCopy.every((product) => {
    productBeingChecked = product;

    return allExistentProductsSet.has(product);
  });

  return {
    exists: allProductsExists,
    inexistentProduct: allProductsExists ? null : productBeingChecked,
  };
}

/**
 * Get all the products
 * @returns {string[]} The products
 */
function getAll() {
  return Product.find();
}

module.exports = {
  exists,
  getAll,
};
