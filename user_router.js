'use strict';
const express = require('express');
const userController = require('./controllers/userController');
//  处理请求
let router = express.Router();

router.get('/login',userController.showLogin);

router.get('/register', userController.showRegister);

module.exports = router;