const DEFAULT_MESSAGE = 'The CNPJ does not exist';

class InexistentCnpjError extends Error {
  constructor(cnpj, message = DEFAULT_MESSAGE) {
    super();
    this.name = InexistentCnpjError.name;
    this.message = message;
    this.cnpj = cnpj;
  }
}

module.exports = InexistentCnpjError;
