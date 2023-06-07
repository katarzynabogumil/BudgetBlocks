import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname+'../.env' });

let dbConfig = {
  database: 'chat',
  username: process.env.SQL_USERNAME || '',
  password: process.env.SQL_PASS || '',
  host: 'localhost',
  dialect: 'postgres'
}

export { dbConfig };