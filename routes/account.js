const router = require('express').Router();
const routerWithAuthentication = require('../utils/routerWithAuthentication')(router);
const Joi = require('joi');
const InvalidUsernameOrPasswordError = require('../errors/invalidUsernameOrPasswordError');
const DuplicatedUsernameError = require('../errors/duplicatedUsernameError');
const WeakPasswordError = require('../errors/weakPasswordError');
const service = require('../services/account');

router.post('/create', (req, res) => {
  const bodySchema = Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string().required(),
  }, { abortEarly: false });

  Joi
    .validate(req.body, bodySchema)
    .then(({ username, password }) => {
      service
        .create(username, password)
        .then(() => res.sendStatus(204))
        .catch(error => res.status(422).send(error));
    })
    .catch(error => res.status(422).send(error));
});

router.post('/login', (req, res) => {
  const bodySchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }, { abortEarly: false });

  Joi
    .validate(req.body, bodySchema)
    .then(({ username, password }) => {
      service
        .login(username, password)
        .then(token => res.status(200).send(token))
        .catch((error) => {
          if (error && error.name && error.name === InvalidUsernameOrPasswordError.name) {
            res.status(401).send(error);
            return;
          }

          res.sendStatus(500);
        });
    })
    .catch(error => res.status(422).send(error));
});

routerWithAuthentication.put('/', (req, res) => {
  const bodySchema = Joi.object({
    password: Joi.string().required(),
    updateData: Joi.object({
      username: Joi.string().email(),
      password: Joi.string(),
    }).required(),
  }, { abortEarly: false });

  Joi
    .validate(req.body, bodySchema)
    .then(({ password, updateData }) => {
      const { username } = res.locals.tokenPayload;

      service
        .update(username, password, updateData)
        .then(() => res.sendStatus(204))
        .catch((error) => {
          const errorName = error.name;

          if (!errorName) {
            res.sendStatus(500);
            return;
          }

          switch (errorName) {
            case InvalidUsernameOrPasswordError.name:
              res.status(401).send(error);
              break;
            case DuplicatedUsernameError.name:
            case WeakPasswordError.name:
              res.status(422).send(error);
              break;
            default:
              res.sendStatus(500);
              break;
          }
        });
    })
    .catch(error => res.status(422).send(error));
});

module.exports = router;
