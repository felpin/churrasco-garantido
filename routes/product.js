const router = require('express').Router();
const routerWithAuthentication = require('../utils/routerWithAuthentication')(router);
const service = require('../services/product');

routerWithAuthentication.get('/', (req, res) => {
  const products = service.getAll();

  res.status(200).send(products);
});

module.exports = router;
