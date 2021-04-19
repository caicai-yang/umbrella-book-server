import BillList, { TBillList } from '../../models/BillList';
import Category, { TCategory } from '../../models/Category';
import Router from 'koa-router';
import dayjs from 'dayjs'
import { fetchDateSec } from '../../utils/index'
const router: Router = new Router()



/**
 * 新建一次记账
 * methods: post
 * path: '/api/createbill'
 */
router.post('/createbill', async ctx => {
  const data = ctx.request.body
  const res = await BillList.insert<TBillList>(data)
  ctx.body = res
})

// 查询某一年某一月的全部数据
router.get('/getDetail', async ctx => {
  // SELECT categoryId, createdAt from billlist where DATE_FORMAT('2021-02-10','%Y-%M')
  const { year, month, uid } = ctx.query
  const foreDate = year + '-' + month + '-01'
  const lastDate = year + '-' + (Number(month) + 1) + '-01'
  const billRes = await BillList.findByDate({
    foreDate, lastDate,
    values: {
      uid
    }
  })
  const categorys = await Category.findAll()
  const { data } = billRes
  let totalExpend = 0, totalIncome = 0
  const json: any = {}
  data.forEach((bill: any) => {
    if (bill.type) totalIncome += bill.money
    else totalExpend += bill.money
    const category: any = categorys.find((category => category.id === bill.categoryId))
    bill['icon'] = category['icon']
    bill['name'] = category['name']
    if (!json[bill['createdAt']]) {
      json[bill['createdAt']] = {}
      json[bill['createdAt']]['totalExpend'] = 0
      json[bill['createdAt']]['totalIncome'] = 0
      json[bill['createdAt']]['data'] = []
    }
    if (bill.type) json[bill['createdAt']]['totalIncome'] += bill.money
    else json[bill['createdAt']]['totalExpend'] += bill.money
    json[bill['createdAt']]['data'].push(bill)
  })
  billRes.data = {
    totalExpend,
    totalIncome,
    data: json
  }
  ctx.body = billRes
})


router.post('/deletebill', async (ctx: any) => {
  const { id, uid } = ctx.request.body
  ctx.body = await BillList.deleteById(id, uid)
})


// 更新某一条账单的数据
router.post('/updateBill', async ctx => {
  const values = ctx.request.body
  const { id } = values
  values['createdAt'] = new Date(values['createdAt'])
  delete values.id
  ctx.body = await BillList.updateById(id, values)
})

// 根据 type, dateSec(日期区间) 获取账单
router.get('/getBillByType', async ctx => {
  // mode：0是年,1是月,2是周
  let { type, dateSec, mode, categoryId, uid } = ctx.query
  const [foreDate, lastDate] = dateSec.split('-')
  const values: any = {}
  if (type) {
    values['type'] = type
  }
  if (categoryId) {
    values['categoryId'] = categoryId
  }
  values['uid'] = uid
  const res = await BillList.findByDate({
    foreDate,
    lastDate,
    order: 'ASC',
    values
  })
  // console.log('res', res['data']);

  const categorys = await Category.findAll()

  const data = res['data'] // [{id, isActived, createdAt: '2021-02-16', ...}]
  const json: any = {}
  const dateArr = fetchDateSec(dateSec) // [ '2021-02-14', '2021-02-15', '2021-02-16', '2021-02-17' ]
  let total = 0, avger = 0
  let series: any[] = []
  dateArr.forEach((date, index) => {
    if (+mode) {
      // 周或者月
      json[index + 1] = []
      series[index] = 0
      data.forEach((item: any) => {
        if (item['createdAt'] === date) {
          const category: any = categorys.find((category => category.id === item.categoryId))
          item['icon'] = category['icon']
          item['name'] = category['name']
          json[index + 1].push(item)
          series[index] += item.money
        }
      })
    } else {
      // 年: 按月来划分
      const dateMonth = dayjs(date).month() + 1
      json[dateMonth] = []
      series[dateMonth - 1] = 0
      data.forEach((item: any) => {
        const itemMonth = dayjs(item['createdAt']).month() + 1
        const category: any = categorys.find((category => category.id === item.categoryId))
        item['icon'] = category['icon']
        item['name'] = category['name']
        if (itemMonth === dateMonth) {
          json[dateMonth].push(item)
          series[dateMonth - 1] += item.money
        }
      })
    }
  })
  data.forEach((item: any) => {
    total += item.money
  })
  avger = Number((total / dateArr.length).toFixed(2))

  res['data'] = {
    total,
    avger,
    series,
    json,
    data
  }
  ctx.body = res
})


router.get('/getBalanceByDate', async ctx => {
  const { date, uid } = ctx.query
  const [year, month] = date.split('-')
  let foreDate = null, lastDate = null
  const data: any = {}
  if (month) {
    // 查询的是月账单
    foreDate = dayjs(`${year}-${month}-01`).format('YYYY-MM-DD')
    lastDate = dayjs(foreDate).add(1, 'month').subtract(1, 'day').format('YYYY-MM-DD')

  } else {
    // 只有 year, 查询的是年度账单
    foreDate = dayjs(`${year}-01-01`).format('YYYY-MM-DD')
    lastDate = dayjs(foreDate).add(1, 'year').subtract(1, 'day').format('YYYY-MM-DD')
  }
  let res = await BillList.findByDate({
    foreDate,
    lastDate,
    values: {
      uid
    }
  })

  if (month) {
    data['income'] = 0
    data['expend'] = 0
    // data['month'] = month
    res['data'].forEach((item: any) => {
      if (item.type) {
        data['income'] += item.money
      } else {
        data['expend'] += item.money
      }
    })
  } else {
    let months = null
    if (+year === dayjs().year()) {
      months = new Array(dayjs().month() + 1).fill(0).map((_, index) => index)
    } else {
      months = new Array(12).fill(0).map((_, index) => index)
    }

    data['income'] = 0
    data['expend'] = 0
    data['data'] = []
    months.forEach(month => {
      data['data'].push({
        income: 0,
        expend: 0
      })
      res['data'].forEach((item: any) => {
        const itemMonth = dayjs(item.createdAt).month()
        if (month === itemMonth) {
          if (item.type) {
            data['data'][month]['income'] += item.money
            data['income'] += item.money
          } else {
            data['data'][month]['expend'] += item.money
            data['expend'] += item.money
          }
        }
      })
    })
  }
  data['income'] = data['income'].toFixed(2)
  data['expend'] = data['expend'].toFixed(2)
  res['data'] = data
  ctx.body = res
})

router.post('/batchCreateBill', async ctx => {
  const data = ctx.request.body
  const res = await BillList.batchInsert<BillList>(data)
  ctx.body = res

})


export default router.routes()