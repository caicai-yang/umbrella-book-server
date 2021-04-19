/**
 * 这个文件只需要执行一次, 当需要向数据库添加新的类目时再执行！！！
 */
import path from 'path';
import fs from 'fs';

import Category, { TCategory } from '../../models/Category'
import { HTTP_CPNFIG } from '../../config/constant';


const BASEPATH = `http://${HTTP_CPNFIG.host}:${HTTP_CPNFIG.port}`
// 将 public 中的文件路径构建为静态路径
function buildHttpPath(array: Array<string>, dirName = '') {
  return array.map(item => {
    if (dirName) {
      return `${BASEPATH}/${dirName}/${item}`
    }
    return `${BASEPATH}/${item}`
  })
}
// 批量处理数据库 insert 操作
function batchInsert(iconArray: Array<string>, categoryArray: Array<string>, type: boolean) {
  iconArray.forEach(async (icon, index) => {
    // 保证顺序存储
    await Category.insert<TCategory>({
      icon,
      name: categoryArray[index],
      type
    })
  })
}

function sortArray(array: Array<string>) {
  return array.sort((a, b) => {
    return parseInt(a) - parseInt(b)
  })
}

// 支出
const expends = fs.readdirSync(path.resolve(__dirname, '../../public/expend'))
const expendsIcons = buildHttpPath(sortArray(expends), 'expend')

const expendCategorys = [
  '餐饮', '购物', '日常', '交通', '运动', '通讯', '服饰', '社交', '医疗', '书籍', '旅行'
]

batchInsert(expendsIcons, expendCategorys, false)

// // 收入
const incomes = fs.readdirSync(path.resolve(__dirname, '../../public/income'))
const incomeIcons = buildHttpPath(sortArray(incomes), 'income')
const incomeCategorys = [
  '工资', '兼职', '理财', '其他'
]
batchInsert(incomeIcons, incomeCategorys, true)

