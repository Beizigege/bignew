const express = require('express')
const cors = require('cors')
const server = express();
const jwt = require('express-jwt');

const users = require('./router/users_router')
const userinfo = require('./router/userinfo_router')
const cates = require('./router/cates_router')

// app.use(jwt().unless());
// jwt() 用于解析token，并将 token 中保存的数据 赋值给 req.user
// unless() 约定某个接口不需要身份认证
server.use(jwt({
    secret: 'hh', // 生成token时的 钥匙，必须统一
    algorithms: ['HS256'] // 必填，加密算法，无需了解
}).unless({
    path: ['/api/login', '/api/refuser', /^\/uploads\/.*/] // 除了这两个接口，其他都需要认证
}));


server.use(cors())
server.use('/api', users)
server.use('/my', userinfo)
server.use('/my/article', cates)
server.use('/uploads', express.static('uploads'))
// server.post('/login', (req, res) => {
//     res.end('ok')
// })
server.listen(6000, () => {
    console.log('6000端口号启动');
})