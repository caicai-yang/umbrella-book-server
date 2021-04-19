import { DOUBLE } from 'sequelize';
import { Table, Column } from 'sequelize-typescript';
import Base, { TBase, TBaseUpdate } from './Base_Table';

// {date: 05年05日, day: '星期五', totalIncome: 100, totalExpence: 100, detail: [{icon: '', category: 餐饮, type: 1|0 1是收入, 0是支出, money: 100}]}
interface TBillList extends TBase {
  type: boolean,
  money: number,
  categoryId: number,
  remark: string
}
interface TBillListUpdate extends TBaseUpdate {
  type?: boolean,
  money?: number,
  categoryId?: number,
  remark: string
}

@Table({
  tableName: 'billlist'
})
class BillList extends Base<BillList> {
  @Column({
    allowNull: false,
  })
  type!: boolean
  @Column({
    type: DOUBLE,
    allowNull: false,
  })
  money!: number
  @Column
  remark!: string
  @Column({
    references: {
      model: 'category',
      key: 'id'
    }
  })
  categoryId!: number
  @Column({
    references: {
      model: 'user',
      key: 'id'
    }
  })
  uid!: number
}

export default BillList
export {
  TBillList,
  TBillListUpdate
}

