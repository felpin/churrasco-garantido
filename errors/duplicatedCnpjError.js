const DEFAULT_MESSAGE = 'There is already a company with this CNPJ';

class DuplicatedCnpjError extends Error {
  constructor(cnpj, message = DEFAULT_MESSAGE) {
    super();
    this.name = DuplicatedCnpjError.name;
    this.message = message;
    this.cnpj = cnpj;
  }
}

module.exports = DuplicatedCnpjError;
