const cnpjUtils = require('cpf_cnpj').CNPJ;
const DuplicatedCnpjError = require('../errors/duplicatedCnpjError');
const InvalidCnpjError = require('../errors/invalidCnpjError');
const Company = require('../models/company');

/**
 * Creates a new company to the user
 * @param {string} userId The user's id
 * @param {string} name The name of the company
 * @param {string} cnpj The CNPJ of the company (without separators)
 * @returns {Promise} Resolved when the company is created
 */
function create(userId, name, cnpj) {
  return new Promise((resolve, reject) => {
    if (!isCnpjValid(cnpj)) {
      reject(new InvalidCnpjError());
      return;
    }

    isCnpjUniqueToUser(userId, cnpj)
      .then((isUnique) => {
        if (!isUnique) {
          reject(new DuplicatedCnpjError(cnpj));
          return;
        }

        const newCompany = new Company({
          name,
          cnpj,
          user: userId,
        });

        newCompany
          .save()
          .then(() => resolve())
          .catch(error => reject(error));
      });
  });
}

/**
 * Check if a CNPJ is already declared for a user
 * @param {string} userId The id of the user
 * @param {string} cnpj The CNPJ to validate
 * @return {Promise<boolean>} If the CNPJ is unique to the user
 */
function isCnpjUniqueToUser(userId, cnpj) {
  return Company
    .find({ user: userId }, 'cnpj')
    .then((companies) => {
      const cnpjSet = new Set(companies.map(({ cnpj: companyCnpj }) => companyCnpj));

      return !cnpjSet.has(cnpj);
    });
}

/**
 * Check if a CNPJ is valid
 * @param {string} cnpj The CNPJ to validate
 * @returns {boolean} If the CNPJ is valid
 */
function isCnpjValid(cnpj) {
  const isValid = cnpjUtils.isValid(cnpj);

  return isValid;
}

module.exports = {
  create,
};
