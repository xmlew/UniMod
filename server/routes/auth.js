const express = require('express');
const { loginUser, signUpUser , homePage} = require('../controllers/auth');

const router = express.Router();

router.post('/signup', signUpUser);
router.post('/login', loginUser);
router.post('/', homePage)

module.exports = router;