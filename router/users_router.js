const express = require('express');
const sql = require('../util/sql');
const router = express.Router();
const conn = require('../util/sql')
const jwt = require("jsonwebtoken")
router.use(express.urlencoded())

router.post('/reguser', (req, res) => {
    // 获取参数
    let { username, password } = req.body
    // console.log(username, password);
    // res.end('ok')
    let sqlSel = `select * from users where username='${username}'`
    // console.log(sqlSel);
    conn.query(sqlSel, (err, result) => {
        // console.log(err);
        if (err) {
            res.json({ code: 500, msg: '服务器错误1' })
            return
        }
        if (result.length > 0) {
            res.json({ code: 201, msg: '已注册过' })
            return
        }

        // 没有注册过就添加新数据
        let sqlStr = `insert into users(username,password) values('${username}','${password}')`
        // console.log(sqlStr);
        conn.query(sqlStr, (err, result) => {
            if (err) {
                res.json({ code: 500, msg: '服务器错误2' })
                return
            }
            res.json({ status: 0, message: '注册成功！' })
        })
    })

})

// 登录
router.post('/login', (req, res) => {
    let { username, password } = req.body
    // console.log(username, password);
    let sqlStr = `select username from users where username="${username}" and password="${password}"`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            if (err) {
                res.json({ code: 500, msg: '服务器错误1' })
                return
            }
        }
        if (result.length > 0) {
            const token = 'Bearer ' + jwt.sign(
                { name: username },
                'hh',
                { expiresIn: 2 * 60 * 60 * 60 }
            )
            res.json({ message: '登录成功', status: 0, data: token })
        } else {
            res.json({ msg: '密码错误', code: 201 })

        }
    })
})


module.exports = router