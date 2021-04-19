import { Table, Column } from 'sequelize-typescript';
import Base, { TBase, TBaseUpdate } from './Base_Table';

interface TUser extends TBase {
  budget: number
}

interface TUserUpdate extends TBaseUpdate {
  budget: number
}

@Table({
  tableName: 'user'
})
class User extends Base<User> {
  @Column({
    allowNull: true
  })
  budget!: number
  @Column({
    allowNull: false
  })
  name!: string
  @Column({
    allowNull: false
  })
  password!: string
}

export default User
export {
  TUser,
  TUserUpdate
}