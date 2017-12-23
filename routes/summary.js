const router = require('express').Router();
const routerWithAuthentication = require('../utils/routerWithAuthentication')(router);
const service = require('../services/summary');

routerWithAuthentication.get('/', (req, res) => {
  const { id } = res.locals.tokenPayload;

  service
    .get(id)
    .then(summary => res.status(200).send(summary))
    .catch(() => res.sendStatus(500));
});

module.exports = router;
