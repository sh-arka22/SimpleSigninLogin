const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const middleware = require('../middleware/middleware');
 
router.post('/signup', userController.create);
 
router.post('/login', userController.login);

module.exports = router;
