import Router from 'koa-router';
const router: Router = new Router()

import Category, { TCategory, TCateforyUpdate } from '../../models/Category';

// getModifyListByType?type=0
router.get('/getCategoryByType', async ctx => {
  const { type } = ctx.query
  // res: {code, message, data}

  const res: any = await Category.findByCondition<TCateforyUpdate>({
    type: type === 'true' ? true : false
  })
  const data = res['data']
  res['data'] = {
    type,
    data
  }
  ctx.body = res
})

// 拿到所有 Category
router.get('/getAllCategory', async ctx => {
  const res = await Category.findAllData({
    attributes: ['id', 'name', 'type']
  })
  ctx.body = res
})

export default router.routes()