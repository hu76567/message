// 引入模块
const express = require('express')
// 创建实例
const app = express();

app.use(express.static('begin'))

app.listen(8084, function () {
    console.log('服务已启动...')
})