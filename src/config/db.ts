import path from 'path';
import { Sequelize, Model } from 'sequelize-typescript'
import { DATABASE_CONFIG } from './constant';

// 第一个参数是数据库名，第二个参数是数据库用户名，第三个参数密码
// 第四个参数配置参数 包括地址，数据库类型等
const sequelize = new Sequelize(DATABASE_CONFIG.dbName, DATABASE_CONFIG.uName, DATABASE_CONFIG.uPass, {
  host: DATABASE_CONFIG.host,
  dialect: DATABASE_CONFIG.dialect,
  define: { // 所有的表名与模型名称相同 
    freezeTableName: true
  },
  sync: { // 在表中进行必要的更改以使其与模型匹配
    alter: true
  },
  pool: { // 连接池
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  timezone: '+08:00', //东八时区
})
sequelize.addModels([
  path.resolve(__dirname, '../models/')
])


sequelize.sync({
  // alter: true
})

export default sequelize