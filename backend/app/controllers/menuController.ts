import { Request, Response } from "express";
import { check, validationResult } from "express-validator";

import { pool } from "../config";
import { MenuSectionAdmin, MenuSectionSQL } from "../types";
import { convertFromHTMLToNormal } from "../utils";

const MenuValidation = [
  check('name').exists().trim().escape().not().isEmpty().isString(),
  check('description').exists().trim().escape().not().isEmpty().isString(),
  check('productList').exists().isArray(),
]

const getMenuAdmin = async (_: Request, res: Response) => {
  pool.query(`SELECT id, name, description, products productList from menu`)
    .then((data) => res
      .status(200)
      // @ts-ignore
      .json((data[0]).map(x => {
        x.productList = JSON.parse(x.productList)
        return x
      })))
    .catch((e) => res.status(500).json(e))
}

const getMenuList = async (_: Request, res: Response) => {
  pool.query('SELECT id, name FROM menu')
    .then((data) => res.status(200).json(data[0]))
    .catch((e) => res.status(500).json(e))
}

const addMenu = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if(errors.isEmpty()) {
    const {
      name,
      description,
      productList
    } = req.body as MenuSectionAdmin

    pool.query(
      'INSERT INTO menu (name, description, products) VALUES (?, ?, ?)',
      [name, description, JSON.stringify(productList)]
    )
      .then(() => res.status(200).json())
      .catch(() => res.status(500).json('Error while add menu section'))
  } else {
    return res.status(400).json(errors)
  }
}

const editMenu = async (req: Request, res: Response) => {
  const menuId = req.params.menuId
  const errors = validationResult(req);

  if(menuId) {
    const [data] = await pool.query('SELECT * FROM menu WHERE id=?', [menuId])
    if(Array.isArray(data) && data.length > 0) {
      if(errors.isEmpty()) {
        const {
          name,
          description,
          productList
        } = req.body as MenuSectionAdmin
        pool.query(
          'UPDATE menu SET name=?, description=?, products=? WHERE id=?',
          [name, description, JSON.stringify(productList), menuId]
        )
          .then(() => res.status(200).json())
          .catch((e) => res.status(400).json(e))
      } else {
        return res.status(400).json(errors)
      }
    } else {
      return res.status(400).json(`Not found product with id: ${menuId}`)
    }
  }
}

const deleteMenu = async (req: Request, res: Response) => {
  const menuId = req.params.menuId

  if(menuId) {
    const [data] = await pool.query('SELECT * FROM menu WHERE id=?', [menuId])
    if(Array.isArray(data) && data.length > 0) {
      pool.query('DELETE FROM menu WHERE id=?', [menuId])
        .then(() => res.status(200).json())
        .catch(() => res.status(500).json('Error while delete menu'))
    } else {
      return res.status(400).json(`Not found menu with id: ${menuId}`)
    }
  }
}

const getMenuById = async (req: Request, res: Response) => {
  const menuId = req.params.menuId

  if(menuId) {
    const [menuData] = await pool.query('SELECT * FROM menu WHERE id=?', [menuId])

    if(Array.isArray(menuData) && menuData.length > 0) {
      const { name, description, products } = menuData[0] as MenuSectionSQL

      const [productsData] = await pool.query(
        `SELECT * FROM products WHERE id IN (${JSON.parse(products)})`
      )

      return res.status(200).json({
        name: convertFromHTMLToNormal(name),
        description: convertFromHTMLToNormal(description),
        // @ts-ignore
        productList: productsData.map(x => {
          x.name = convertFromHTMLToNormal(x.name)
          x.description = convertFromHTMLToNormal(x.description)
          return x
        })
      })
    } else {
      return res.status(400).json(`Not found menu with id: ${menuId}`)
    }
  }
}

export {
  MenuValidation,
  getMenuAdmin,
  addMenu,
  editMenu,
  deleteMenu,
  getMenuList,
  getMenuById
}
