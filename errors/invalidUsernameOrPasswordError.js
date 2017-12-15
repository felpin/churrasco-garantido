const DEFAULT_MESSAGE = 'The username or password is invalid';

class InvalidUsernameOrPasswordError extends Error {
  constructor(message = DEFAULT_MESSAGE) {
    super();
    this.name = InvalidUsernameOrPasswordError.name;
    this.message = message;
  }
}

module.exports = InvalidUsernameOrPasswordError;
