const express = require('express');

const router = express.Router();
const { signup } = require('../controller/admin');
const { getadmins } = require('../controller/admin');
const { getadmin } = require('../controller/admin');
const { login } = require('../controller/admin');
const { logout } = require('../controller/admin');

const { auth } = require('../middleware/auth');

router.post('/signup', signup);
router.get('/getadmin', getadmin);
router.get('/getadmins', getadmins);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
