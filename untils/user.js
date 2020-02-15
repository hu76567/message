//封装对user.json操作的模块

const fs = require('fs')
const path = require('path')


const FILE_PATH = path.join(__dirname, "../database/user.json")

// 获取  
const get = () => {
    // 读取json中的内容
    let fileStr = fs.readFileSync(FILE_PATH, 'utf-8')
    // 转json对象
    let arr = JSON.parse(fileStr)
    return arr
}

// 添加
/**
 * 
 * @param {用户名} name 
 * @param {*密码} pwd 
 * @param {*头像} avatar 
 */
const add = (name, pwd, avatarUrl) => {
    let arr = get();
    let id = arr.length ? arr[arr.length - 1].id + 1 : 1
    arr.push({
        // id是数组最后一个元素id+1
        id,
        name,
        pwd,
        avatarUrl,
    })
    // 写回数据
    fs.writeFileSync(FILE_PATH, JSON.stringify(arr))
    return arr;
}

// 导出模块
module.exports = {
    add,
    get
}