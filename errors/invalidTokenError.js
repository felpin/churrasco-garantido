const DEFAULT_MESSAGE = 'The token is invalid';

class InvalidTokenError extends Error {
  constructor(message = DEFAULT_MESSAGE) {
    super();
    this.name = InvalidTokenError.name;
    this.message = message;
  }
}

module.exports = InvalidTokenError;
