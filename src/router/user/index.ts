import Router from 'koa-router';
import User, { TUser, TUserUpdate } from '../../models/User'
import BillList from '../../models/BillList'
import dayjs from 'dayjs'
import billList from '../billList';
const router: Router = new Router()

// 登录
router.post('/login', async ctx => {
  const { name, password } = ctx.request.body
  console.log(name, password);
  const res = await User.findByCondition({
    name, password
  })
  const hasUser = res['data'].length === 0 ? false : true
  if (hasUser) {
    res['data'] = {
      id: res['data'][0]['id'],
      createdAt: res['data'][0]['createdAt']
    }
    ctx.body = res
  } else {
    ctx.body = {
      code: 0,
      msg: '用户不存在',
      data: []
    }
  }

})
// 注册
router.post('/reg', async ctx => {
  const { name, password } = ctx.request.body
  // 查询数据库
  const hasUser = (await User.findByCondition({
    name, password
  }))['data'].length === 0 ? false : true
  if (!hasUser) {
    const res = await User.insert({ name, password })
    ctx.body = res
  } else {
    ctx.body = {
      code: 0,
      msg: '用户已存在',
      data: []
    }
  }

})

router.post('/setBudget', async ctx => {
  const { date, budget, uid } = ctx.request.body
  const res = await User.updateById(uid, {
    budget
  })
  // 所有支出
  const year = dayjs(date).year()
  const month = dayjs(date).month() + 1
  const foreDate = dayjs(`${year}-${month}-01`).format('YYYY-MM-DD')
  const lastDate = dayjs(foreDate).add(1, 'month').subtract(1, 'day').format('YYYY-MM-DD')
  const expendArr = (await BillList.findByDate({
    foreDate,
    lastDate,
    values: {
      type: false,
      uid
    }
  }))['data']
  const totalExpend = expendArr.reduce((temp: any, expend: any) => {
    return temp + expend.money
  }, 0)
  res['data'] = {
    totalBudget: +budget,
    totalExpend
  }
  ctx.body = res
})

// 查询预算与当月支出
router.get('/getBudget', async ctx => {
  const { uid, date } = ctx.query
  const { budget } = (await User.findById(uid))['data']
  const year = dayjs(date).year()
  const month = dayjs(date).month() + 1
  const foreDate = dayjs(`${year}-${month}-01`).format('YYYY-MM-DD')
  const lastDate = dayjs(foreDate).add(1, 'month').subtract(1, 'day').format('YYYY-MM-DD')
  const res = await BillList.findByDate({
    foreDate,
    lastDate,
    values: {
      type: false,
      uid
    }
  })
  const totalNumber = (await BillList.findByCondition({ uid }))['data'].length
  const expendArr = res['data']
  const totalExpend = expendArr.reduce((temp: any, expend: any) => {
    return temp + expend.money
  }, 0)
  res['data'] = {
    totalBudget: +budget,
    totalExpend,
    totalNumber
  }
  ctx.body = res

})

export default router.routes()