const router = require('express').Router();

router.use('/account', require('./account'));
router.use('/company', require('./company'));
router.use('/product', require('./product'));

module.exports = router;
