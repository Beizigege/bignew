const express = require('express');
const sql = require('../util/sql');
const router = express.Router();
const conn = require('../util/sql')
const jwt = require("jsonwebtoken");
const multer = require('multer');

// 获取文章分类列表
router.get('/cates', (req, res) => {
    let sqlStr = `select * from articles `
    // console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ code: 500, msg: "服务器错误" })
            return
        }
        res.json({ status: 0, message: '获取文章分类列表成功！', data: result })
    })
})
// 新增文章分类
router.post('/addcates', (req, res) => {
    let { name, slug } = req.body
    let sqlStr = `insert into categories(name,slug) values("${name}","${slug}")`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ code: 500, msg: "服务器错误" })
            return
        }
        res.json({
            "status": 0,
            "message": "新增文章分类成功！"
        })
    })
})

router.get('/deletecate', (req, res) => {
    let { id } = req.query
    let sqlStr = `delete from categories where id = ${id}`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ code: 500, msg: "服务器错误" })
        }
        res.json({
            "status": 0,
            "message": "删除文章分类成功！"
        })
    })
})

router.get('/getCatesById', (req, res) => {
    let { id } = req.query
    let sqlStr = `select * from categories where id=${id}`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ code: 500, msg: "服务器错误" })
            return
        }
        res.json({
            "status": 0,
            "message": "获取文章分类数据成功", data: result
        })
    })
})

router.post('/updatecate', (req, res) => {
    let { id, name, slug } = req.body
    let cond = [];
    if (name) {
        cond.push(`name="${name}"`)
    }
    if (slug) {
        cond.push(`slug="${slug}"`)
    }
    let sonder = cond.join()
    // console.log(sonder);
    let sqlStr = `update categories set ${sonder} where id=${id}`
    conn.query(sqlStr, (err, result) => {
        // console.log(err);
        if (err) {
            res.json({ code: 500, msg: "服务器错误" })
            return

        }
        res.json({
            "status": 0,
            "message": "更新分类信息成功！"
        })
    })
})
module.exports = router