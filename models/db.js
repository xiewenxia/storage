'use strict';

// 引入数据库对象
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: '123',
    database: 'node_music'
});

let query = function (sql,props,callback) {
    pool.getConnection((err,connection) => {
        if(err) return next(err);
        // 下面数组是为了数据库查询时传递参数
        connection.query(sql, props, (error, data)=>{
            connection.release();
            callback(error,data);
            
        })
    })
}

// 将q向外暴露
module.exports = {
    query: query
};