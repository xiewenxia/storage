'use strict';
const express = require('express');
const userController = require('./controllers/userController');
const musicController = require('./controllers/musicController');
// 4 处理请求
let router = express.Router();
// 抽取查询功能后的毁掉函数
router.get('/get', userController.doTest)

// 检查用户名是否存在
.post('/check-user', userController.checkUser)

// 用户注册功能
.post('/do-register',userController.doRegister)

// 用户登录功能

.post('/do-login',userController.doLogin)
.get('/do-logout',userController.logout)
// 添加音乐
.post('/add-music', musicController.addMusic)

// 编辑音乐
.put('/update-music',musicController.updateMusic)

// 删除音乐
.delete('/del-music', musicController.delMusic)
//配置路由规则 结束,要向外暴露

module.exports = router;