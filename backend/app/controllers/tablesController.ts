import { Request, Response } from "express";
import { pool } from "../config";
import { Order, Statuses } from "../types";

const getTables = async (req: Request, res: Response) => {
  return pool.query('SELECT * FROM tables').then((x) => res.status(200).json(x[0]))
}

const getFreeTables = async (req: Request, res: Response) => {
  return pool.query('SELECT * FROM tables')
    .then(async (x) => {
      const tables = x[0] as { id: number, description: string }[]
      const invalidTables = await pool.query(`SELECT * FROM orders WHERE status=${Statuses.Created} AND orderTable IS NOT NULL`)
      const invalidTablesIds = (invalidTables[0] as Order[]).map(x => x.orderTable)
      const validTables = tables.filter((x) => !invalidTablesIds.includes(x.id))

      return res.status(200).json(validTables)
    })
}

export {
  getTables,
  getFreeTables
}
