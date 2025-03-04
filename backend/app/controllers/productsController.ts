import { Request, Response } from "express";
import { check, validationResult } from "express-validator";

import { pool } from "../config";

import { HasId, Product, WeightType } from "../types";
import { convertFromHTMLToNormal } from "../utils";

const ProductValidation = [
  check('name').exists().escape().trim().not().isEmpty().isString(),
  check('description').exists().escape().trim().not().isEmpty().isString(),
  check('preview').optional().isURL(),
  check('inStopList').exists().not().isEmpty().isBoolean({strict: true}),
  check('price').exists().not().isEmpty().isInt({min: 1}).not().isString(),
  check('weight').exists().not().isEmpty().isInt({min: 1}).not().isString(),
  check('weightType').exists().escape().not().isEmpty().isIn(Object.values(WeightType)),
]

const getProducts = async (_: Request, res: Response) => {
  pool.query('SELECT * FROM products')
    .then((data) => {
      // @ts-ignore
      return res.json(data[0].map(x => {
        x.name = convertFromHTMLToNormal(x.name)
        x.description = convertFromHTMLToNormal(x.description)
        return x
      }))
    })
}

const addProduct = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if(errors.isEmpty()) {
    const {
      name,
      weight,
      weightType,
      preview=  '',
      description,
      price,
      inStopList
    } = req.body as Product
    pool.query(
      `INSERT INTO products (name, description, inStopList, price, weight, weightType, preview)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description, inStopList, price, weight, weightType, preview]
    )
      .then(() => res.status(200).json())
      .catch(() => res.status(400).json())
  } else {
    return res.status(400).json(errors)
  }
}

const editProduct = async (req: Request, res: Response) => {
  const productId = req.params.productId
  const errors = validationResult(req);

  if(productId) {
    const [data] = await pool.query('SELECT * FROM products WHERE id=?', [productId])
    if(Array.isArray(data) && data.length > 0) {
      if(errors.isEmpty()) {
        const {
          name,
          weight,
          weightType,
          preview=  '',
          description,
          price,
          inStopList
        } = req.body as Product
        pool.query(
          `UPDATE products SET name=?, description=?, inStopList=?, price=?, weight=?, weightType=?, preview=? WHERE id=?`,
          [name, description, inStopList, price, weight, weightType, preview, productId]
        )
          .then(() => res.status(200).json())
          .catch((e) => res.status(400).json(e))
      } else {
        return res.status(400).json(errors)
      }
    } else {
      return res.status(400).json(`Not found product with id: ${productId}`)
    }
  }
}

const deleteProduct = async (req: Request, res: Response) => {
  const productId = req.params.productId

  if(productId) {
    const [data] = await pool.query('SELECT * FROM products WHERE id=?', [productId])
    if(Array.isArray(data) && data.length > 0) {
      const menuIdsWithProduct: (HasId & { products: number[] })[] = await pool.query(
        `SELECT id, products 
         FROM menu
         WHERE JSON_CONTAINS(products, ?, '$') > 0`,
        [productId]
      )
        // @ts-ignore
        .then((data) => data[0].map(x => {
          x.products = JSON.parse(x.products)
          return x
        }))
      for(const {id, products} of menuIdsWithProduct) {
        await pool.query(
          'UPDATE menu SET products=? WHERE id=?',
          [JSON.stringify(products.filter(x => x !== Number(productId))), id]
        )
      }
      pool.query('DELETE FROM products WHERE id=?', [productId])
        .then(() => res.status(200).json())
        .catch(() => res.status(500).json('Error while delete product'))
    } else {
      return res.status(400).json(`Not found product with id: ${productId}`)
    }
  }
}

const getProductsByIDs = async (req: Request, res: Response) => {
  const { products } = req.body as { products: Product[] }

  const [productsFromDB] = await pool.query(`SELECT * FROM products WHERE id IN (${products})`)

  if (
    Array.isArray(productsFromDB)
    && productsFromDB.length > 0
  ) {
    return res
      .status(200)
      .json((productsFromDB as Product[]).map(x => {
        x.name = convertFromHTMLToNormal(x.name)
        x.description = convertFromHTMLToNormal(x.description)
        return x
      }))
  } else {
    return res.status(400).json()
  }
}

export {
  ProductValidation,
  getProducts,
  addProduct,
  editProduct,
  deleteProduct,
  getProductsByIDs
}
