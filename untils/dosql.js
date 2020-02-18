// 封装 node 对数据库操作的模块

// 引入sql包
var mysql = require('mysql');



function doSql(sqlStr, callback) {
    // 配置
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'database'
    });

    // 连接
    connection.connect();

    connection.query(sqlStr, (err, data) => {
        callback(err, data)
    });
    // 关闭
    // connection.end();
}


module.exports = {
    doSql
}

// doSql("select id,name from users", function (err, data) {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(data)
//     }
// }
// )
