import { Table, Column, Model, DataType } from 'sequelize-typescript';
import sequelize, { Op } from 'sequelize'
import dayjs from 'dayjs'
// import sequelize from '../config/db';

const NAME = 'dataValues'
const condition = {
  isActived: true
}

function handleSuccess(data: any) {
  return {
    code: 0,
    message: 'ok',
    data
  }
}
function handleError(error: Error, code = 500) {
  return {
    code,
    message: error.message || '服务器忙',
    data: []
  }
}

interface TBase {
  id?: number,
  isActived?: boolean,
  createAt?: Date,
  updateAt?: Date
}
interface TBaseUpdate {
  isActived?: boolean,
  createAt?: Date,
  updateAt?: Date
}

@Table({
  tableName: 'base',
  timestamps: false
})
class Base<T> extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  // 非空断言
  id!: number
  @Column({
    allowNull: false,
    defaultValue: true
  })
  isActived!: boolean

  @Column({
    allowNull: false,
    type: DataType.DATEONLY,
    defaultValue: dayjs().format('YYYY-MM-DD')
  })
  createdAt!: Date

  @Column({
    allowNull: false,
    type: DataType.DATEONLY,
    defaultValue: dayjs().format('YYYY-MM-DD')
  })
  updatedAt!: Date

  static async findById(id: number): Promise<any> {
    try {
      let data: any = await this.findOne({
        where: {
          id,
          ...condition
        }
      })
      data = data[NAME]
      return handleSuccess(data)
    } catch (error) {
      return handleError(error)
    }
  }

  static async findByCondition<T>(values: T): Promise<any> {
    try {
      let data: any = await this.findAll({
        where: {
          ...values,
          ...condition
        }
      })
      return handleSuccess(data)
    } catch (error) {
      return handleError(error)
    }
  }

  // 查询某一年某一月的全部数据
  static async findByDate({ foreDate, lastDate, order = 'DESC', values = {} }: { foreDate: string, lastDate: string, order?: string, values?: any }): Promise<any> {
    // select * from billlist where createdAt >= DATE('2021-2-01') and createdAt < DATE('2021-3-01')
    try {
      let data: any = await this.findAll({
        where: {
          createdAt: {
            [Op.gte]: sequelize.fn('DATE', foreDate),
            [Op.lte]: sequelize.fn('DATE', lastDate)
          },
          ...values,
          ...condition
        },
        order: [['createdAt', order]]
      })
      data = data.map((item: any) => item[NAME])
      return handleSuccess(data)
    } catch (error) {
      return handleError(error)
    }
  }

  static async findAllData(config: {}): Promise<any> {
    try {
      let data: any = await this.findAll({
        ...config,
        where: {
          ...condition
        }
      })
      if (data.length > 0) {
        data = data.map((item: any) => item[NAME])
        return handleSuccess(data)
      }
    } catch (error) {
      return handleError(error)
    }
  }

  static async insert<T>(values: T): Promise<any> {
    try {
      await this.create(values)
      return handleSuccess('insert data success')
      // return handleSuccess([res[NAME]])
    } catch (error) {
      return handleError(error)
    }

  }

  static async batchInsert<T>(array: Array<T>): Promise<any> {
    try {
      array.forEach(async item => {
        await this.create(item)
      })
      return handleSuccess('batch insert success')
    } catch (error) {
      return handleError(error)
    }
  }

  static async updateById<T>(id: number, values: T): Promise<any> {
    try {
      const [data] = await this.update(values, {
        where: { id }
      })
      if (data === 0) {
        // code=0
        return handleError(new Error('没有数据被修改'), 0)
      } else {
        return handleSuccess([`${data}条数据被修改`])
      }
    } catch (error) {
      return handleError(error)
    }
  }

  static async deleteById(id: number, uid?: number): Promise<any> {
    return this.updateById(id, {
      isActived: false,
      uid
    })
  }
}

export default Base
export {
  TBase,
  TBaseUpdate
}