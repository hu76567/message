// 引入模块
const express = require('express')
const multer = require('multer')
const bodyParser = require('body-parser')
// 创建实例
const app = express();

//1.引入session包
const session = require('express-session');
//2. 配置session
let conf = {
    secret: '123456', //加密字符串。 使用该字符串来加密session数据，自定义
    resave: false, //强制保存session即使它并没有变化
    saveUninitialized: false //强制将未初始化的session存储。当新建了一个session且未
    //设定属性或值时，它就处于未初始化状态。
};

//3. 使用express-session
app.use(session(conf));

// 引入封装好的模块
const user = require('./untils/user')

// 引入自定义模块用来操作mysql
const dosql = require("./untils/dosql")

// 托管静态资源
app.use(express.static('user'))
// 引用body-parser
app.use(bodyParser.urlencoded({ extended: false }))
// 文件要存入的目录
const upload = multer({ dest: 'avatars/' })

//接口实现注册功能,用户信息放入database和头像保存在avatars文件夹
// avatar文件键名
// app.post("/user_add", upload.single("avatar"), function (req, res) {
//     // console.log(req.file)
//     // console.log(req.body)

//     //    操作数据
//     let { name, pwd } = req.body;
//     let avatarUrl = req.file.path;
//     user.add(name, pwd, avatarUrl);
//     res.send({
//         code: 200,
//         msg: "用户注册成功"
//     })
// })

// 与数据库交互   注册
app.post("/user_add_sql", upload.single("avatar"), function (req, res) {
    // console.log(req.file)
    // console.log(req.body)

    //    操作数据
    let { name, pwd } = req.body;
    let avatarUrl = req.file.path;
    // user.add(name, pwd, avatarUrl);
    let sqlStr = `insert into  users(name,pwd)  values("${name}","${pwd}")`
    dosql.doSql(sqlStr, function (err, data) {
        if (err) {
            // console.log(err)
            res.send({
                code: 400,
                msg: "服务器端出错",
            })
        } else {
            if (data.affectedRows === 1) {
                res.send({
                    code: 200,
                    msg: "用户注册成功"
                })
            } else {
                res.send({
                    code: 200,
                    msg: "用户注册失败"
                })
            }
        }
    })

})





// 对json文件操作
// 用户登录  键值对 name，pwd   返回 登陆成功
// app.post("/user_login", (req, res) => {
//     let { name, pwd } = req.body;
//     // console.log(name, pwd)
//     let users = user.get();

//     let curUser = users.find(function (item) {
//         // console.log(item)
//         if (item.name === name && item.pwd === pwd) {
//             return true
//         }
//     })
//     console.log(curUser)
//     if (curUser) {
//         // 通过session发放凭证
//         req.session.isLogin = true;
//         req.session.name = name;

//         // 随后会给浏览器设置cookie,
//         res.send({
//             code: 200,
//             msg: "登陆成功",
//             data: curUser,
//         })
//     } else {
//         res.send({
//             code: 400,
//             msg: "用户名或密码错误,请重新输入",
//         })
//     }
// })

// 操作sql  登陆

app.post("/user_login_sql", (req, res) => {
    // 1.解构赋值
    let { name, pwd } = req.body;
    // 2.根据name，pwd去数据库中搜索
    // 找到登陆成功，找不到登陆失败
    let sqlStr = ` select  name,pwd  from  users  where  name = "${name}" and pwd="${pwd}"`
    dosql.doSql(sqlStr, function (err, data) {
        if (err) {
            console.log(err)
            res.send({
                code: 400,
                msg: "服务器端出错",
            })

        } else {
            console.log(data)
            if (data.length > 0) {
                // 通过session发放凭证
                req.session.isLogin = true;
                req.session.name = name;

                // 随后会给浏览器设置cookie,
                res.send({
                    code: 200,
                    msg: "登陆成功",
                })
            } else {
                res.send({
                    code: 400,
                    msg: "用户名或密码错误,请重新输入",
                })
            }
        }
    })




    // console.log(curUser)
    // 返回值
    // if (curUser) {
    //     // 通过session发放凭证
    //     req.session.isLogin = true;
    //     req.session.name = name;

    //     // 随后会给浏览器设置cookie,
    //     res.send({
    //         code: 200,
    //         msg: "登陆成功",
    //         data: curUser,
    //     })
    // } else {
    //     res.send({
    //         code: 400,
    //         msg: "用户名或密码错误,请重新输入",
    //     })
    // }
})




// 获取用户信息,验证session
app.get('/get_user', (req, res) => {
    let isLogin = req.session.isLogin
    let name = req.session.name
    if (isLogin) {
        res.send({
            code: 200,
            data: {
                name,
            }
        })
    } else {
        res.send({
            code: 400,
            msg: '您还没有登录'
        })
    }
})



app.get('/quit', (req, res) => {
    req.session.destroy();
    res.send({
        code: 200,
        msg: "quit"
    })
})



app.listen(8084, function () {
    console.log('服务器已启动...')
})