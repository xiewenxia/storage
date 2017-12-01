'use strict';

const db = require('../models/db.js');
// 解析文件上传
const formidable = require('formidable');
// 引入path核心对象
const path = require('path');
//引入配置对象
const config = require('../config');

let musicController = {

}
/**
 * [添加音乐]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
musicController.addMusic = (req, res, next) => {
    //判断是否存在session上的user
    // if(!req.session.user){
    //     res.send(`
    //              请去首页登录
    //              <a href="/user/login">点击</a>
    //         `);
    //     return;
    // }
    // console.log(req.session.user);
    // 上述会打印出登陆用户的信息
    var form = new formidable.IncomingForm();
    // 设置默认路径
    form.uploadDir = path.join(config.rootPath,'public/files');
    // console.log(form.uploadDir);
    // F:\jiuyeban\node\day05\music\public\files
    form.parse(req, function(err, fields, files) {
        if(err) return next(err);
        // console.log(fields);
        // console.log(files);
        // 获取前三个字段的数据
        let datas = [fields.title,fields.singer,fields.time];
        let sql = 'insert into musics (title,singer,time,';
        let params = '(?,?,?';
        // 判断音乐文件是否存在
        if(files.file) {
            let filename = path.parse(files.file.path).base;
            datas.push(`/public/files/${filename}`);
            sql += 'file,';
            params +=',?';
        }
        if(files.filelrc) {
            let lrcname = path.parse(files.filelrc.path).base;
            datas.push(`/public/files/${lrcname}`);
            sql += 'filelrc,';
            params +=',?';
        }
        params += ',?)';
        sql += 'uid) values';
        // 用户的id，在此是要知道是给哪个用户添加音乐，这个id是从session存储中取到的，在用户登录zhi
        datas.push(req.session.user.id);
        console.log(datas);
        // console.log(sql);
        // console.log(params);
        // insert into musics (title,singer,time,file,filelrc,uid) values
        // (?,?,?,?,?,?)

        db.query(sql + params, datas,(err, data) => {
            res.json({
                code: '001',
                msg: '添加成功'
            })
        })
        
    })
}
/**
 * [编辑音乐]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
musicController.updateMusic =  (req,res,next) => {
    
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(config.rootPath,'public/files');
    form.parse(req, function(err, fields, files) {
        if(err) return next(err);
        // console.log(fields);
        // console.log(files);
        // 获取前三个字段的数据
        let datas = [fields.title,fields.singer,fields.time];
        let sql = 'update musics set title=?,singer=?,time=?,';
        let params = '(?,?,?';
        // 判断音乐文件是否存在
        if(files.file) {
            let filename = path.parse(files.file.path).base;
            datas.push(`/public/files/${filename}`);
            sql += 'file=?,';
        }
        if(files.filelrc) {
            let lrcname = path.parse(files.filelrc.path).base;
            datas.push(`/public/files/${lrcname}`);
            sql += 'filelrc=?,';
        }
        sql = sql.substr(0, sql.length-1);
        console.log(sql);
        // 这个地方的id是客户端从前端传过来的id（添加一个隐藏域，给隐藏域绑定一个id）
        console.log(fields.id);
        // update musics set title=?,singer=?,time=?,file=?,filelrc=?
        sql += 'where id = ?';
        datas.push(fields.id);
        // 更新音乐列表
        db.query(sql, datas, (err, data) => {
            res.json({
                code: '001',
                msg: '更新音乐成功'
            })
        })
        
        
    })

}
/**
 * [删除音乐]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
musicController.delMusic = (req, res, next) => {
    // 获取用户id
    let userid = req.session.user.id;
    console.log(userid);

    // 获取用户参数音乐id
    let musicId = req.query.id;
    // 根据音乐id查询数据库
    db.query('delete from musics where id = ? and uid = ?', [musicId,userid], (err, result) => {
        if(err) return next(err);
        console.log(result); 
         //判断是否删除成功
         if(result.affectedRows == 0){
            //歌曲不存在
            return res.json({
                code:'002',msg:'歌曲不存在'
            });
        }
        //删除成功
        res.json({
            code:'001',msg:'删除成功'
        });
    })
    
}
/**
 * [显示增加音乐列表]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
musicController.showAddMusic = (req, res, next) => {
    res.render('add.html');
}
/**
 * [显示音乐列表]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
musicController.showListMusic = (req,res, next) => {
    // res.render('list.html');

    let userid = req.session.user.id;
    db.query('select * from musics where uid = ?',[userid],(err,musics)=> {
        // console.log(musics);
        res.render('list.html',{
            musics: musics
        })
    })

}
musicController.showEdit = (req, res, next) => {
    let musicId = req.params.id;
    console.log(musicId);
    // 根据音乐id查询数据库
    db.query('select * from musics where id=?', [musicId], (err, datas) => {
        // console.log(datas)
        res.render('edit.html', {
            musics: datas[0]
        })
    })
}
//向外导出
module.exports = musicController;