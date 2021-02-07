const express = require('express');
const passport = require('passport');

const router = express.Router();
const { signup } = require('../controller/admin');
const { getadmins } = require('../controller/admin');
const { getadmin } = require('../controller/admin');
const { login } = require('../controller/admin');
const { logout } = require('../controller/admin');
const { auth } = require('../middleware/auth');

router.post('/signup', auth, signup);
router.get('/getadmin', auth, getadmin);
router.get('/getadmins', auth, getadmins);
router.post('/login', passport.authenticate('local'), login);
router.post('/logout', auth, logout);

module.exports = router;
