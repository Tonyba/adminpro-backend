const { Router } = require('express');
const { login, googleSignIn } = require('../controllers/auth');
const router = Router();
const { check } = require('express-validator');

router.post('/', [check('email', 'Email must be valid').isEmail(), check('password', 'Password cannot be empty').not().isEmpty()], login);

router.post('/google', [check('token', 'token google must be valid').not().isEmpty()], googleSignIn);

module.exports = router;
