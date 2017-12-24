const InvalidTokenError = require('../errors/invalidTokenError');
const jwt = require('./jwt');

/**
 * Configures the router to challenge the authorization header before execute its function
 * @param {any} router The express' router object
 * @param {string} httpMethod Any http method known by the router (get, post etc.)
 */
function configureAuthentication(router, httpMethod) {
  /**
   * Validates the request's authorization before execute its function
   * @param {string} path A valid path for the router
   * @param {function} callback A function to execute if the request is authorized
   */
  function httpMethodAuthenticated(path, callback) {
    router[httpMethod](path, (req, res) => {
      validateRequest(req, res)
        .then(() => callback(req, res))
        .catch(() => { });
    });
  }

  return httpMethodAuthenticated;
}

/**
 * Include the WWW-Authenticate header and send a 401 HTTP code
 * @param {any} res The express' response object
 */
function includeWwwAuthenticateHeader(res) {
  res.set('WWW-Authenticate', 'Bearer');
  res.sendStatus(401);
}

/**
 * Validates if the Authorization header is well-formed
 * @param {any} req The express' request object
 * @param {any} res The express' response object
 * @returns {Promise<string>} The token in the Authorization header
 */
function validateAuthorizationHeader(req, res) {
  return new Promise((resolve, reject) => {
    const authorizationHeader = req.get('Authorization');

    if (!authorizationHeader) {
      includeWwwAuthenticateHeader(res);
      return reject();
    }

    const authorizationHeaderItems = authorizationHeader.split(' ');
    const schema = authorizationHeaderItems[0];
    const thereIsTwoItensInAuthenticationHeader = authorizationHeaderItems.length === 2;
    const firstItemIsBearer = /^Bearer$/.test(schema);

    if (thereIsTwoItensInAuthenticationHeader && !firstItemIsBearer) {
      includeWwwAuthenticateHeader(res);
      return reject();
    }

    if (!thereIsTwoItensInAuthenticationHeader) {
      res.sendStatus(400);
      return reject();
    }

    const token = authorizationHeaderItems[1];
    return resolve(token);
  });
}

/**
 * Validates if the token is valid
 * @param {any} req The express' request object
 * @param {any} res The express' response object
 * @returns {Promise} If resolved, then is valid
 */
function validateRequest(req, res) {
  return validateAuthorizationHeader(req, res)
    .then(token => new Promise((resolve, reject) => {
      jwt
        .validate(token)
        .then((payload) => {
          res.locals.tokenPayload = payload;
          resolve();
        })
        .catch(() => {
          res.status(401).send(new InvalidTokenError());
          reject();
        });
    }))
    .catch(() => { });
}

module.exports = router => ({
  get: configureAuthentication(router, 'get'),
  post: configureAuthentication(router, 'post'),
  put: configureAuthentication(router, 'put'),
  delete: configureAuthentication(router, 'delete'),
});
