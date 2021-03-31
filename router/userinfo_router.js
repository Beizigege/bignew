const express = require('express');
const sql = require('../util/sql');
const router = express.Router();
const conn = require('../util/sql')
const jwt = require("jsonwebtoken");
const multer = require('multer');

router.use(express.urlencoded())

// 获取用户基本信息
router.get('/userinfo', (req, res) => {
    let { id, username, nickname, email, user_pic } = req.query
    // console.log(username);
    let sqlStr = `select * from users where username="${username}"`
    // console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        // console.log(result[0]);
        if (err) {
            res.json({ code: 500, msg: "服务器错误" })
        }
        res.json({ status: 0, message: "获取用户基本信息成功！", data: result })
    })
})

// 更新用户的基本信息
router.post("/userinfo", (req, res) => {
    let { id, nickname, email, userPic } = req.body
    console.log(id, nickname, email, userPic);
    let cond = [];
    if (nickname) {
        cond.push(`nickname="${nickname}"`)
    }
    if (email) {
        cond.push(`email="${email}"`)
    }
    if (userPic) {
        cond.push(`userPic="${userPic}"`)
    }
    const conder = cond.join()
    console.log(conder);
    let sqlStr = `update  users set ${conder} where id=${id}`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ code: 500, msg: "服务器错误" })
        }
        res.json({ status: 0, message: '用户修改信息成功' })
    })
})

// 精细化去设置，如何去保存文件
const storage = multer.diskStorage({
    // 保存在哪里
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    // 保存时，文件名叫什么
    filename: function (req, file, cb) {
        // console.log('file', file)
        // 目标： 新名字是时间戳+后缀名
        const filenameArr = file.originalname.split('.');
        // filenameArr.length-1是找到最后一个元素的下标
        const fileName = Date.now() + "." + filenameArr[filenameArr.length - 1]
        cb(null, fileName)
    }
})

// 上传头像
const upload = multer({ storage })
router.post('/uploadPic', upload.single('file_data'), (req, res) => {
    // console.log(req.file);
    res.json({
        status: 0,
        message: "http://127.0.0.1:6000/uploads/" + req.file.filename,
    })
})

// 重置密码
router.post('/updatepwd', (req, res) => {
    console.log(req.body);
    let { id, oldPwd, newPwd } = req.body
    // console.log(id, oldPwd, newPwd);
    let sqlStr = `select password="${oldPwd}"  from users where id=${id}`
    // console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        console.log(result);
        if (err) {
            res.json({ code: 500, msg: "服务器错误" })
        }
        if (result.length > 0) {
            let sqlStrs = `update users set password="${newPwd}" where id=${id}`
            console.log(sqlStrs);
            conn.query(sqlStr, (err, result) => {
                if (err) {
                    res.json({ code: 500, msg: "服务器错误" })
                }
                res.json({
                    "status": 0,
                    "message": "更新密码成功！"
                })
            })
        } else {
            res.json({
                "status": 1,
                "message": "更新密码失败！"
            })
        }
    })
})
module.exports = router