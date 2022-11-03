const router = require('express').Router();
const { police_check } = require('../../middleware');
const transController = require('./controller');

router.post('/transaction',
police_check('create', 'Transaction'),
 transController.transact)
router.get('/transaction', 
police_check('read', 'Transaction'),
transController.index)

module.exports = router;