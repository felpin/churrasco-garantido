const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

/**
 * Creates a JWT
 * @param {Object} payload The payload of the JWT
 * @returns {Promise<string>} The JWT
 */
function create(payload) {
  return new Promise((resolve, reject) => {
    const fourHoursInSeconds = 4 * 60 * 60;

    const jwtOptions = {
      expiresIn: fourHoursInSeconds,
    };

    jwt.sign(payload, secret, jwtOptions, (error, token) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
  });
}

/**
 * Validates a JWT
 * @param {string} token The JWT token to validate
 * @returns {Promise<Object>} The payload of the JWT
 */
function validate(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, payload) => {
      if (error) {
        reject(error);
      } else {
        resolve(payload);
      }
    });
  });
}

module.exports = {
  create,
  validate,
};
