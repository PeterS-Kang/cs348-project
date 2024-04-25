const { login, register } = require('../controllers/UsersController');

const router = require('express').Router();

// login 
router.post('/login', login)

// register
router.post('/register', register)

module.exports = router;