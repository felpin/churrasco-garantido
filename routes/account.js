const router = require('express').Router();
const Joi = require('joi');
const service = require('../services/account');

router.get('/', (req, res) => {
  res.sendStatus(204);
});

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

module.exports = router;
