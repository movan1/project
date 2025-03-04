import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { Order } from "../types";
import { pool } from "../config";

export const isAvailableProducts = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if(errors.isEmpty()) {
    const { products } = req.body as Pick<Order, 'products'>

    const [productsFromDB] = await pool.query(`SELECT * FROM products WHERE id IN (${products})`)

    if (
      Array.isArray(productsFromDB)
      && products.length === productsFromDB.length
    ) {
      next()
    } else {
      return res.status(400).json('Some products are not available or exist')
    }
  } else {
    return res.status(400).json(errors)
  }
}
