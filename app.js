'use strict';
// 1引入express对象
const express = require('express');

// 2开启服务
let app = express();
// 配置模板引擎
app.engine('html', require('express-art-template'));


// 引入处理post请求体对象
const bodyParser = require('body-parser');

// 引入session 
const session = require('express-session');
// 3开启监听端口
app.listen(9999, () => {
    console.log('9999端口服务已启动');
})

const api_router = require('./web_router');
const user_router = require('./user_router');
const music_router = require('./music_router');

//处理静态资源
app.use('/public',express.static('./public'));
// 首先：在路由使用session之前，先产生session
app.use(session({
    secret: 'itcast', //唯一标识，必填
    resave: false, 
    //true强制保存,不管有没有改动session中的数据，依然重新覆盖一次
    saveUninitialized: true,//一访问服务器就分配session
    //如果为false,当你用代码显式操作session的时候才分配
    // cookie: { secure: true // 仅仅在https下使用 }
  }));
//第0件事:处理post请求体数据
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// 在用户访问别的页面之前，检测用户是否登陆，如果未登陆，则跳转到登陆页面
app.use(/\/music|\/api\/.*music/,(req, res, next) => {
    console.log(req.session.user);
    //判断是否存在session上的user
    if(!req.session.user){
        res.send(`
                 请去首页登录
                 <a href="/user/login">点击</a>
            `);
        return;
    }
    next();
})

// 1：路由
app.use('/api',api_router);
// 页面路由
app.use('/user',user_router);
// 音乐列表路由
app.use('/music',music_router);

// 2：错误处理中间件
app.use((err, req, res, next) => {
    console.log(err);
    res.send(`
            <div>
                您要访问的页面不在啦，请稍后再试
                <a href="/">去首页</a>
            </div>`)
})