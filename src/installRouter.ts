// import Koa from 'koa';
import Router from 'koa-router';
// routers
import category from './router/category/index';
import billList from './router/billList/index';
import user from './router/user/index'


export default function (app: Router) {
  app.use(category)
  app.use(billList)
  app.use(user)
}