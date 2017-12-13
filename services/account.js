const crypto = require('crypto');
const DuplicatedUsernameError = require('../errors/duplicatedUsernameError');
const InvalidUsernameOrPasswordError = require('../errors/invalidUsernameOrPasswordError');
const WeakPasswordError = require('../errors/weakPasswordError');
const User = require('../models/user');
const jwtUtils = require('../utils/jwt');

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
 * Authorize a user
 * @param {string} username The username of the user
 * @param {string} password The password of the user
 * @returns {Promise<string>} The JWT to use as authentication
 */
function login(username, password) {
  return new Promise((resolve, reject) => {
    User
      .findOne({ username })
      .then((user) => {
        if (!user) {
          reject(new InvalidUsernameOrPasswordError());
          return;
        }

        const { salt, password: hash } = user;
        const generatedHash = generatePasswordHash(password, salt);
        if (hash !== generatedHash) {
          reject(new InvalidUsernameOrPasswordError());
          return;
        }

        jwtUtils
          .create({ username })
          .then(token => resolve(token))
          .catch(error => reject(error));
      });
  });
}

module.exports = {
  create,
  login,
};
