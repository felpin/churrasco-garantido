const DEFAULT_MESSAGE = 'This username already exists';

class DuplicatedUsernameError extends Error {
  constructor(username, message = DEFAULT_MESSAGE) {
    super();
    this.name = DuplicatedUsernameError.name;
    this.message = message;
    this.username = username;
  }
}

module.exports = DuplicatedUsernameError;
