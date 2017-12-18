const DEFAULT_MESSAGE = 'The product does not exist';

class InexistentProductError extends Error {
  constructor(product, message = DEFAULT_MESSAGE) {
    super();
    this.name = InexistentProductError.name;
    this.message = message;
    this.product = product;
  }
}

module.exports = InexistentProductError;
