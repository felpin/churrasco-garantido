const router = require('express').Router();

router.use('/account', require('./account'));
router.use('/companies', require('./company'));
router.use('/orders', require('./order'));
router.use('/products', require('./product'));
router.use('/summary', require('./summary'));

module.exports = router;
