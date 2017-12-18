const router = require('express').Router();
const routerWithAuthentication = require('../utils/routerWithAuthentication')(router);
const Joi = require('joi');
const DuplicatedCnpjError = require('../errors/duplicatedCnpjError');
const InvalidCnpjError = require('../errors/invalidCnpjError');
const service = require('../services/company');

routerWithAuthentication.get('/', (req, res) => {
  const { id } = res.locals.tokenPayload;

  service
    .getAll(id)
    .then(companies => res.status(200).send(companies))
    .catch(() => res.sendStatus(500));
});

routerWithAuthentication.post('/', (req, res) => {
  const NUMBERS_IN_CNPJ = 14;

  const bodySchema = Joi.object({
    name: Joi.string().required(),
    cnpj: Joi.string().length(NUMBERS_IN_CNPJ).required(),
  }, { abortEarly: false });

  Joi
    .validate(req.body, bodySchema)
    .then(({ name, cnpj }) => {
      const { id } = res.locals.tokenPayload;

      service
        .create(id, name, cnpj)
        .then(() => res.sendStatus(201))
        .catch((error) => {
          const errorName = error.name;

          if (!errorName) {
            res.sendStatus(500);
            return;
          }

          switch (errorName) {
            case DuplicatedCnpjError.name:
            case InvalidCnpjError.name:
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
