import { Request, Response } from "express";
import { pool } from "../config";

const getTables = async (req: Request, res: Response) => {
  return pool.query('SELECT * FROM tables').then((x) => res.status(200).json(x[0]))
}

export {
  getTables
}
