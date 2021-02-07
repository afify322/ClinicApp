const express = require('express');

const router = express.Router();
const { AddClerk } = require('../controller/clerk');
const { UpdateClerk } = require('../controller/clerk');
const { FindClerk } = require('../controller/clerk');
const { DeleteClerk } = require('../controller/clerk');
const { Attended } = require('../controller/clerk');
const { getAttendance } = require('../controller/clerk');
const { Count } = require('../controller/clerk');
const { salary } = require('../controller/clerk');
const { Expenses } = require('../controller/clerk');
const { transactions } = require('../controller/clerk');
const {finances} =require ('../controller/clerk')
router.get('/GroupFinances', finances);
router.post('/AddClerk', AddClerk);
router.patch('/UpdateClerk', UpdateClerk);
router.get('/FindClerk', FindClerk);
router.delete('/DeleteClerk', DeleteClerk);
router.patch('/Attended', Attended);
router.get('/GetAttendance', getAttendance);
router.get('/Count', Count);
router.post('/salary', salary);
router.post('/Expenses', Expenses);
router.get('/GetTransactions', transactions);

module.exports = router;
