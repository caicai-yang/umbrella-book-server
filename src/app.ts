import path from 'path';
import Koa from 'koa';              // 导入koa
import Router from "koa-router";    // 导入koa-router
import Static from 'koa-static';
import Cors from 'koa-cors';
import bodyParser from 'koa-bodyparser';


import install from './installRouter';
import { HTTP_CPNFIG } from './config/constant';

import './config/db';

const app: Koa = new Koa();              // 新建一个Koa对象
const router: Router = new Router({
  prefix: '/api'
})

// 跨域
app.use(Cors())
app.use(bodyParser())

// 注册所有路由
install(router)
app.use(router.routes())

// 静态资源访问
app.use(Static(path.resolve(__dirname, './public')))


app.listen(HTTP_CPNFIG.port);           // 监听3000端口

console.log(`server running on http://${HTTP_CPNFIG.host}:${HTTP_CPNFIG.port}`);