'use strict';
const express = require('express');
const musicController = require('./controllers/musicController');
//  处理请求
let router = express.Router();

router.get('/add-music',musicController.showAddMusic)
.get('/list-music', musicController.showListMusic)
module.exports = router;