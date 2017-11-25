'use strict';
// 引入数据库操作对象db
const db = require('../models/db.js');
let userController = {

}
/**
 * [测试]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
userController.doTest = (req, res, next) => {
    db.query('select * from users',[], (err, data) => {
        if(err) return next(err);
        res.render('test.html',{
            text: data[0].username
        })
    })
}
/**
 * [检测用户名是否存在]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
userController.checkUser = (req, res, next) => {
    // 获取请求体中的数据，(req.body.username中的username一定要与前端页面的name对应)
    // 在发送post请求之前，记得引入post请求体对象
    let username = req.body.username;
    db.query('select * from users where username =?', [username], (err, data) => {
        if(err) return next(err);
        // console.log(data);
        // 如果用户输入的用户名已经存在，则即data中取到的data不为空，如果查询用户不存在
        // 则提示可以注册
        if(data.length == 0) {
            res.json({
                code:'001',
                msg: '可以注册'
            })
        }else {
            res.json({
                code:'002',
                msg: '用户名已经存在'
            })
        }
    })
}
/**
 * [注册]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
userController.doRegister =  (req, res, next) => {
    //1 接收用户提交过来的数据
     let username = req.body.username;
     let password = req.body.password;
     let v_code = req.body.v_code;
     let email = req.body.email;
    // 2 处理数据
    // 2.1 验证验证码（暂时不处理）
    // 2.2 验证邮箱
    let regex = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    if(!regex.test(email)) {
        res.json({
            code:'004',
            msg: '邮箱bu合法'
        });
        return;
    }
    // 验证用户名或者邮箱是否存在，来判定用户能否注册该账号
    // 查询数据库
    db.query('select * from users where username =? or email =?',[username, email], (err, data) => {
        if(err) return next(err);
        // console.log(data);
        // 结果为如果用户名或密码其中任一个在数据库中已经存在，则data为该数据
        // 如果用户名或邮箱均未被使用，查询到的data为一个空数组
        // 接下来进行业务的判断
        if(data.length != 0) {
            // 有可能是用户名已经存在，也可能是邮箱已经存在
            let user = data[0];
            if(user.eamil == email) {
                return res.json({
                    code: '002',
                    msg: '邮箱已经存在'
                });
            }else if (user.username == username) {
                return res.json({
                    code: '002',
                    msg: '用户名已经存在'
                });
            }
        }else {
            // 用户名和密码都不存在，可以进行注册
            // 将用户提交的数据保存到数据库
            db.query('insert into users (username,password,email) value (?,?,?)', [username, password, email], (err, data) => {
                if(err) return next(err);
                console.log(data);
                // OkPacket {fieldCount: 0, affectedRows: 1,insertId: 2,serverStatus: 2,
                // warningCount: 0,message: '', protocol41: true,changedRows: 0 }
                res.json({
                    code: '001',
                    msg: '注册成功'
                })
            })

        }
    })
}
/**
 * [登陆]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
userController.doLogin =  (req, res, next) => {
    // 1接受数据
    let username = req.body.username;
    let password = req.body.password;
    let remember_me  = req.body.remember_me;
    // 将用户名作为条件，查询数据库
    db.query('select * from users where username =?',[username], (err, data) => {
        if(err) return next(err);
        // console.log(data);
        // 首先查询，用户名是否已经存在，如果不存在，提示该账号未注册
        // 如果用户名存在，则检验密码是否匹配用户
        if(data.length == 0) {
            return res.json({
                code: '002',
                msg: '用户名或者密码不存在'
            })
        }

        // 用户存在，检验密码是否匹配
        if(data[0].password != password) {
            return res.json({
                code: '002',
                msg: '用户名或者密码不存在'
            })
        }
        // ===登陆后，在此给session上存储用户数据
        req.session.user = data[0];
        // console.log(req.session.user);
        return res.json({
            code: '001',
            msg: '登陆成功'
        })
    })
}
/**
 * [退出]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
userController.logout = (req, res, next) => {
    req.session.user = null;
    res.json({
        code: '001',
        msg: '退出成功'
    })
}
/**
 * [显示登陆页面]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
userController.showLogin = (req,res,next) => {
    res.render('login.html');
}

/**
 * [显示注册页面]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
userController.showRegister = (req,res,next) => {
    res.render('register.html');
}
//向外导出
module.exports = userController;