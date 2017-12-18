const DEFAULT_MESSAGE = 'The CNPJ is invalid';

class InvalidCnpjError extends Error {
  constructor(message = DEFAULT_MESSAGE) {
    super();
    this.name = InvalidCnpjError.name;
    this.message = message;
  }
}

module.exports = InvalidCnpjError;
