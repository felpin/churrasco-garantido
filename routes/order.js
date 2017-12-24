const router = require('express').Router();
const routerWithAuthentication = require('../utils/routerWithAuthentication')(router);
const Joi = require('joi');
const InexistentCnpjError = require('../errors/inexistentCnpjError');
const InexistentOrderError = require('../errors/inexistentOrderError');
const InexistentProductError = require('../errors/inexistentProductError');
const service = require('../services/order');

routerWithAuthentication.post('/', (req, res) => {
  const NUMBERS_IN_CNPJ = 14;

  const bodySchema = Joi.object({
    cnpj: Joi.string().length(NUMBERS_IN_CNPJ).required(),
    products: Joi.array().min(1).items(Joi.object({
      name: Joi.string().required(),
      quantity: Joi.number().greater(0).required(),
    })).required(),
  }, { abortEarly: false });

  Joi
    .validate(req.body, bodySchema)
    .then(({ cnpj, products }) => {
      const { id } = res.locals.tokenPayload;

      service
        .create(id, cnpj, products)
        .then(() => res.sendStatus(201))
        .catch((error) => {
          const errorName = error.name;

          if (!errorName) {
            res.sendStatus(500);
            return;
          }

          switch (errorName) {
            case InexistentCnpjError.name:
            case InexistentProductError.name:
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

routerWithAuthentication.delete('/:code', (req, res) => {
  const { id } = res.locals.tokenPayload;
  const { code } = req.params;

  service
    .exclude(id, code)
    .then(() => res.sendStatus(204))
    .catch((error) => {
      const errorName = error.name;

      if (!errorName) {
        res.sendStatus(500);
        return;
      }

      switch (errorName) {
        case InexistentOrderError.name:
          res.status(422).send(error);
          break;
        default:
          res.sendStatus(500);
          break;
      }
    });
});

module.exports = router;
