const Order = require('../models/order');
const companyService = require('../services/company');

/**
 * A summary of the user's companies and orders
 * @typedef {Object} SummaryItem
 * @param {string} name The name of the company
 * @param {string} cnpj The CNPJ of the company (without separations)
 * @param {number} orders The quantity of the orders of this company
 */

/**
 * Get a summary of the user's companies and orders
 * @param {string} userId The user's id
 * @returns {Promise<SummaryItem[]>} A summary of the user's companies and orders
 */
function get(userId) {
  return new Promise((resolve, reject) => {
    companyService
      .getAll(userId)
      .then((companies) => {
        const mapCnpjToSummaryItem =
          new Map(companies.map(({ name, cnpj }) => [cnpj, { name, cnpj, orders: 0 }]));
        const cnpjs = Array.from(mapCnpjToSummaryItem.keys());

        Order
          .find({ active: true, user: userId, cnpj: { $in: cnpjs } }, 'cnpj products')
          .then((orders) => {
            orders.forEach(({ cnpj }) => {
              const summaryItem = mapCnpjToSummaryItem.get(cnpj);

              summaryItem.orders += 1;
            });

            const summary = Array.from(mapCnpjToSummaryItem.values());
            resolve(summary);
          })
          .catch(error => reject(error));
      })
      .catch(error => reject(error));
  });
}

module.exports = {
  get,
};
