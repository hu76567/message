// 引入模块
const express = require('express')
const multer = require('multer')

// 引入封装好的模块
const user = require('./untils/user')
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

    //    操作数据
    let { name, pwd } = req.body;
    let avatarUrl = req.file.path;
    user.add(name, pwd, avatarUrl);
    res.send({
        code: 200,
        msg: "用户注册成功"
    })
})

app.listen(8084, function () {
    console.log('服务已启动...')
})