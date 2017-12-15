const DEFAULT_MESSAGE = 'The password is too weak';

class WeakPasswordError extends Error {
  constructor(message = DEFAULT_MESSAGE) {
    super();
    this.name = WeakPasswordError.name;
    this.message = message;
  }
}

module.exports = WeakPasswordError;
