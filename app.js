// 引入模块
const express = require('express')
const multer = require('multer')
// 创建实例
const app = express();
// 托管静态资源
app.use(express.static('user'))
// 文件要存入的目录
const upload = multer({ dest: 'avatars/' })

//接口实现注册功能,用户信息放入database和头像保存在avatars文件夹
// avatar文件键名
app.post("/user_add", upload.single("avatar"), function (req, res) {
    console.log(req.file)
    console.log(req.body)
    res.send("测试成功")
})

app.listen(8084, function () {
    console.log('服务已启动...')
})