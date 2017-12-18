const DEFAULT_MESSAGE = 'The order does not exist';

class InexistentOrderError extends Error {
  constructor(order, message = DEFAULT_MESSAGE) {
    super();
    this.name = InexistentOrderError.name;
    this.message = message;
    this.order = order;
  }
}

module.exports = InexistentOrderError;
