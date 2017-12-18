const router = require('express').Router();

router.use('/account', require('./account'));
router.use('/company', require('./company'));

module.exports = router;
