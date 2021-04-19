interface DataBaseConfig {
  dbName: string,
  uName: string,
  uPass: string,
  host: string,
  dialect: any
}
const DATABASE_CONFIG: DataBaseConfig = {
  dbName: 'umbrella-book',
  uName: 'root',
  uPass: '123456',
  host: 'localhost',
  dialect: 'mysql'
}

interface HttpConfig {
  host: string,
  port: number
}

const HTTP_CPNFIG: HttpConfig = {
  host: 'localhost',
  port: 3000
}



export {
  DATABASE_CONFIG,
  HTTP_CPNFIG
}