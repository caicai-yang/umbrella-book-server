import { Table, Column } from 'sequelize-typescript';
import Base, { TBase, TBaseUpdate } from './Base_Table';
// id:xxx, icon: '', name: 餐饮
interface TCategory extends TBase {
  icon: string,
  name: string,
  // true 是收入, false 是支出
  type: boolean
}

interface TCateforyUpdate extends TBaseUpdate {
  icon?: string,
  category?: string,
  type?: boolean
}


@Table({
  tableName: 'category'
})
class Category extends Base<Category> {
  @Column({
    allowNull: false,
    // unique: true
  })
  icon!: string
  @Column({
    allowNull: false,
    // unique: true
  })
  name!: string;
  @Column({
    allowNull: false
  })
  type!: number
}

export default Category
export {
  TCategory,
  TCateforyUpdate
}