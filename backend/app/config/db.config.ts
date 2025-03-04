import { createPool } from 'mysql2'
import 'dotenv/config'

export const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  typeCast: (field, next) => {
    if (field.type === 'TINY') {
      const bytes = field.buffer();
      return (bytes && bytes.toString() === '1')
    }
    return next()
  }
}).promise()
