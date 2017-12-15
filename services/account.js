const crypto = require('crypto');
const DuplicatedUsernameError = require('../errors/duplicatedUsernameError');
const InvalidUsernameOrPasswordError = require('../errors/invalidUsernameOrPasswordError');
const WeakPasswordError = require('../errors/weakPasswordError');
const User = require('../models/user');
const jwtUtils = require('../utils/jwt');

/**
 * The data related to an account
 * @typedef {Object} AccountData
 * @property {string} username The username of a user
 * @property {string} password The password of a user
 */

/**
 * Creates a new user on the database
 * @param {string} username The username of the user
 * @param {string} password The password of the user
 */
function create(username, password) {
  return doesUsernameAlreadyExist(username)
    .then(usernameExists => new Promise((resolve, reject) => {
      if (usernameExists) {
        reject(new DuplicatedUsernameError(username));
        return;
      }

      if (!isPasswordStrongEnough(password)) {
        reject(new WeakPasswordError());
        return;
      }

      createUser(username, password)
        .then(() => resolve())
        .catch(err => reject(err));
    }));
}

/**
 * Create a new user in database
 * @param {string} username The user's username
 * @param {string} password The user's password
 * @returns {Promise} Promise to be resolved when the user is created
 */
function createUser(username, password) {
  const salt = generateSalt();
  const hash = generatePasswordHash(password, salt);

  const newUser = new User({
    username,
    password: hash,
    salt,
  });

  return newUser.save();
}

/**
 * Test if a password contains a number
 * @param {string} password The password to test
 * @returns {boolean} If the password contains a number
 */
function doesPasswordContainsNumber(password) {
  return /\d/.test(password);
}

/**
 * Test if a password contains a lowercase letter
 * @param {string} password The password to test
 * @returns {boolean} If the password contains a lowercase letter
 */
function doesPasswordContainsLowercaseLetter(password) {
  return /[a-z]/.test(password);
}

/**
 * Test if a password contains an uppercase letter
 * @param {string} password The password to test
 * @returns {boolean} If the password contains an uppercase letter
 */
function doesPasswordContainsUppercaseLetter(password) {
  return /[A-Z]/.test(password);
}

/**
 * Check if a username already exists in the database
 * @param {string} username The username to verify
 * @returns {Promise<boolean>} If the username exists in database
 */
function doesUsernameAlreadyExist(username) {
  return User
    .findOne({ username })
    .then(user => user !== null);
}

/**
 * Generate a random string be salt for a password
 */
function generateSalt() {
  const NUM_BYTES = 16;
  return crypto.randomBytes(NUM_BYTES).toString('hex');
}

/**
 * Generate a hash based on a password and a hash
 * @param {string} password The password of the user
 * @param {string} salt The salt of the password
 */
function generatePasswordHash(password, salt) {
  const allTogether = password.concat(salt);
  const hash = crypto.createHash('sha256').update(allTogether).digest('hex');

  return hash;
}

/**
 * Tests if the password contains at least six characters
 * @param {string} password The password to test
 * @returns {boolean} If the password contains at least six characters
 */
function isPasswordLongEnough(password) {
  const MIN_LENGTH = 6;
  return password.length >= MIN_LENGTH;
}

/**
 * Tests if the password is strong (check all requirements)
 * @param {string} password The password to test
 * @returns {boolean} If the password is strong
 */
function isPasswordStrongEnough(password) {
  return doesPasswordContainsNumber(password)
    && doesPasswordContainsLowercaseLetter(password)
    && doesPasswordContainsUppercaseLetter(password)
    && isPasswordLongEnough(password);
}

/**
 * Checks if a user is authorized (username and password matches)
 * @param {string} username The username of the user
 * @param {string} password The password of the user
 * @returns {Promise<boolean>} If the user is authorized
 */
function isUserAuthorized(username, password) {
  return new Promise((resolve) => {
    User
      .findOne({ username })
      .then((user) => {
        if (!user) {
          return resolve(false);
        }

        const { salt, password: hash } = user;
        const generatedHash = generatePasswordHash(password, salt);
        if (hash !== generatedHash) {
          return resolve(false);
        }

        return resolve(true);
      });
  });
}

/**
 * Authorize a user
 * @param {string} username The username of the user
 * @param {string} password The password of the user
 * @returns {Promise<string>} The JWT to use as authentication
 */
function login(username, password) {
  return isUserAuthorized(username, password)
    .then((isAuthorized) => {
      if (!isAuthorized) {
        throw new InvalidUsernameOrPasswordError();
      }

      return jwtUtils.create({ username });
    });
}

/**
 * Updates an account
 * @param {string} username The username of the user
 * @param {string} password The password of the user
 * @param {AccountData} newAccountData The values of the account to update
 * @returns {Promise} The user updated model
 */
function update(username, password, newAccountData) {
  return isUserAuthorized(username, password)
    .then((isAuthorized) => {
      if (!isAuthorized) {
        throw new InvalidUsernameOrPasswordError();
      }

      return User
        .findOne({ username })
        .then((user) => {
          const { username: newUsername, password: newPassword } = newAccountData;

          return Promise
            .all([updateUsername(user, username, newUsername), updatePassword(user, newPassword)])
            .then(() => user.save());
        });
    });
}

/**
 * Updates a user model with a new password
 * @param {Object} user The user model
 * @param {string} newPassword The password to replace the current
 * @returns {Promise} Resolved when the password is set
 */
function updatePassword(user, newPassword) {
  return new Promise((resolve, reject) => {
    if (!newPassword) {
      return resolve();
    }

    if (!isPasswordStrongEnough(newPassword)) {
      return reject(new WeakPasswordError());
    }

    const { salt } = user;
    const newPasswordHash = generatePasswordHash(newPassword, salt);

    user.set({ password: newPasswordHash });
    return resolve();
  });
}

/**
 * Updates a user model with a new username
 * @param {Object} user The user model
 * @param {string} oldUsername The current username
 * @param {string} newUsername The username to replace the current
 * @returns {Promise} Resolved when the username is set
 */
function updateUsername(user, oldUsername, newUsername) {
  return new Promise((resolve, reject) => {
    if (!newUsername || oldUsername === newUsername) {
      return resolve();
    }

    return doesUsernameAlreadyExist(newUsername)
      .then((isDuplicated) => {
        if (isDuplicated) {
          return reject(new DuplicatedUsernameError(newUsername));
        }

        user.set({ username: newUsername });
        return resolve();
      });
  });
}

module.exports = {
  create,
  login,
  update,
};
