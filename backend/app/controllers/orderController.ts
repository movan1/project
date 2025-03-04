import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import {check, validationResult} from "express-validator";

import { pool } from "../config";

import {
  FullUser, HasId, Order,
  OrderType, Product, Statuses,
  UserRoles, UserToken
} from "../types";
import {convertFromHTMLToNormal, getDateForDB} from "../utils";
import {exists} from "fs";

const tokenSecret = process.env.TOKEN_SECRET

const BaseOrderValidation = [
  check('products').exists().isArray({ min: 1 }),
]

const WaiterOrderValidation = [
  ...BaseOrderValidation,
  check('orderTable').exists().isInt().not().isString(),
]

const UserPayOrderValidation = [
  check('tips').exists().not().isEmpty().isInt({min: 0}).not().isString(),
]

const ValidNewStatuses = Object
  .values(Statuses)
  .filter((x) => typeof x === 'number' && x !== Statuses.Created);

const getOrders = async (req: Request, res: Response) => {
  const auth =  req.headers.authorization

  if(auth && tokenSecret) {
    const userToken = jwt.verify(auth.split(' ')[1], tokenSecret) as UserToken

    const [user] = await pool.query('SELECT * FROM users WHERE name=?', [userToken.name])

    if(Array.isArray(user) && user.length > 0) {
      const { id, role } = user[0] as HasId & FullUser;

      // @ts-ignore
      let ordersData = []
      if(role === UserRoles.User) {
        const [ordersList] = await pool.query('SELECT o.*, u.name FROM orders o LEFT JOIN users u on o.waiter_id = u.id WHERE waiter_id=?', [id])
        // @ts-ignore
        ordersData = ordersList
      } else {
        const [ordersList] = await pool.query('SELECT o.*, u.name FROM orders o LEFT JOIN users u on o.waiter_id = u.id')
        // @ts-ignore
        ordersData = ordersList
      }

      if(Array.isArray(ordersData) && ordersData.length > 0) {
        const orders: Order[] = []

        for(const o of ordersData) {
          const { products, waiter_id, ...order } = o as Order

          const [productsData] = await pool.query(
            // @ts-ignore
            `SELECT * FROM products WHERE id IN (${JSON.parse(products)})`
          )

          // @ts-ignore
          orders.push({
            ...order,
            date: `${order.date}Z`,
            // @ts-ignore
            products: productsData.map(x => {
              x.name = convertFromHTMLToNormal(x.name)
              x.description = convertFromHTMLToNormal(x.description)
              return x
            })
          })
        }

        return res.status(200).json(orders)
      }
    }
  }
}

const createUserOrder = async (req: Request, res: Response) => {
  const { products } = req.body as Pick<Order, 'products'>

  const totalPrice = await pool.query(`SELECT * FROM products WHERE id IN (${products})`)
    .then(([productsFromDB]) => {
      let price = 0
      for(const product of productsFromDB as Product[]) {
        price += product.price
      }
      return price
    })

  pool.query(
    `INSERT INTO orders (date, orderType, products, totalPrice, tips, status)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [getDateForDB(), OrderType.Self, JSON.stringify(products), totalPrice, 0, Statuses.Completed]
  )
    // @ts-ignore
    .then((x) => res.status(200).json({ id: x[0].insertId }))
    .catch((e) => res.status(500).json(e))
}

const createWaiterOrder = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization
  if(!tokenSecret) return res.status(500).json()
  if(!authHeader) return res.status(401).json()
  if(!authHeader.includes('Bearer')) return res.status(401).json()

  const { id } = jwt.verify(authHeader.split(' ')[1], tokenSecret) as UserToken

  const { products, orderTable } = req.body as Pick<Order, 'products' | 'orderTable'>

  const isOrderCreatedOnThisTable = await pool.query('SELECT * FROM orders WHERE orderTable=? AND status=?', [orderTable, Statuses.Created])
    .then(([data]) => Array.isArray(data) && data.length > 0)
    .catch((e) => res.status(500).json(e))

  if(isOrderCreatedOnThisTable) {
    return res.status(400).json('Order on this table is already exist')
  }

  const isWaiterExist = await pool.query('SELECT * FROM users WHERE id=?', [id])
    .then(([waitersList]) => {
      if(Array.isArray(waitersList) && waitersList.length === 1) {
        return true
      }
      return false
    })
    .catch(() => false)

  const isTableExist = await pool.query('SELECT * FROM tables WHERE id=?', [orderTable])
    .then(([tablesList]) => {
      if(Array.isArray(tablesList) && tablesList.length === 1) {
        return true
      }
      return false
    })
    .catch(() => false)

  const totalPrice = await pool.query(`SELECT * FROM products WHERE id IN (${products})`)
    .then(([productsFromDB]) => {
      let price = 0
      for(const product of productsFromDB as Product[]) {
        price += product.price
      }
      return price
    })

  if(isWaiterExist && isTableExist) {
    pool.query(
      `INSERT INTO orders (date, orderType, products, totalPrice, tips, waiter_id, orderTable, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [getDateForDB(), OrderType.Hall, JSON.stringify(products), totalPrice, 0, id, orderTable, Statuses.Created]
    )
      .then(() => res.status(200).json())
      .catch((e) => res.status(500).json(e))
  } else {
    return res.status(400).json('Waiter or table does not exist')
  }
}

const editWaiterOrder = async (req: Request, res: Response) => {
  const authReq = req.headers.authorization
  if(!tokenSecret) return res.status(500).json()
  if(!authReq) return res.status(401).json()
  if(!authReq.includes('Bearer')) return res.status(401).json()

  const { id, role } = jwt.verify(authReq.split(' ')[1], tokenSecret) as UserToken

  const orderId = req.params.orderId
  const { products, orderTable } = req.body as Pick<Order, 'products' | 'orderTable'>

  const isTableExist = await pool.query('SELECT * FROM tables WHERE id=?', [orderTable])
    .then(([tablesList]) => {
      if(Array.isArray(tablesList) && tablesList.length === 1) {
        return true
      }
      return false
    })
    .catch(() => false)

  const isValidOrder = await pool.query('SELECT * FROM orders WHERE id=? AND status=?', [orderId, Statuses.Created])
    .then(([ordersList]) => {
      if(Array.isArray(ordersList) && ordersList.length === 1) {
        const order = ordersList[0] as Order
        const isSameTable =  order.orderTable === orderTable;
        const isValidUser = order.waiter_id === id || role === UserRoles.Admin
        return isSameTable && isValidUser
      }
      return false
    })

  if(isTableExist && isValidOrder) {
    const totalPrice = await pool.query(`SELECT * FROM products WHERE id IN (${products})`)
      .then(([productsFromDB]) => {
        let price = 0
        for(const product of productsFromDB as Product[]) {
          price += product.price
        }
        return price
      })

    pool.query(
      "UPDATE orders SET orderTable=?, products=?, totalPrice=? WHERE id=?",
      [orderTable, JSON.stringify(products), totalPrice, orderId]
    )
      .then(() => res.status(200).json())
      .catch((e) => res.status(500).json(e))
  } else {
    return res.status(400).json('Table not exist or order not valid')
  }
}

const changeOrderStatus = async (req: Request, res: Response) => {
  const orderId = req.params.orderId

  const { status } = req.body as { status: Statuses }

  const authReq = req.headers.authorization
  if(!tokenSecret) return res.status(500).json()
  if(!authReq) return res.status(401).json()
  if(!authReq.includes('Bearer')) return res.status(401).json()

  const { id, role } = jwt.verify(authReq.split(' ')[1], tokenSecret) as UserToken

  pool.query('SELECT * FROM orders WHERE id=? AND status=?', [orderId, Statuses.Created])
    .then(([ordersList]) => {
      if (Array.isArray(ordersList) && ordersList.length === 1) {
        if(ValidNewStatuses.includes(status)) {
          const order = ordersList[0] as Order;
          if(order.waiter_id === id || role === UserRoles.Admin) {
            pool.query('UPDATE orders SET status=? WHERE id=?', [status, orderId])
              .then(() => res.status(200).json())
              .catch((e) => res.status(500).json(e))
          } else {
            return res.status(400).json('Invalid user')
          }
        } else {
          return res.status(400).json('Invalid status to update')
        }
      } else {
        return res.status(400).json('Not found order with Created status')
      }
    })
}

const getOrderByTable = async (req: Request, res: Response) => {
  const tableId = req.params.tableId

  if(tableId) {
    const [ordersList] = await pool.query(
      'SELECT o.*, u.name FROM orders o LEFT JOIN users u on o.waiter_id = u.id WHERE orderTable=? AND status=?',
      [tableId, Statuses.Created]
    )

    if(Array.isArray(ordersList) && ordersList.length === 1) {
      const { products, waiter_id, ...order } = ordersList[0] as Order

      const [productsData] = await pool.query(
        // @ts-ignore
        `SELECT * FROM products WHERE id IN (${JSON.parse(products)})`
      )

      return res.status(200).json(({
        ...order,
        date: `${order.date.toLocaleString()}Z`,
        // @ts-ignore
        products: productsData.map(x => {
          x.name = convertFromHTMLToNormal(x.name)
          x.description = convertFromHTMLToNormal(x.description)
          return x
        })
      }))
    } else {
      return res.status(400).json('Invalid get order data')
    }
  } else {
    return res.status(400).json('Table not found')
  }
}

const payUserOrder  = async (req: Request, res: Response) => {
  const errors = validationResult(req)

  if(errors.isEmpty()) {
    const orderId = req.params.orderId
    const { tips } = req.body

    pool.query('SELECT * FROM orders WHERE id=? AND status=?', [orderId, Statuses.Created])
      .then(([ordersList]) => {
        console.log(ordersList)
        if (Array.isArray(ordersList) && ordersList.length === 1) {
          const { totalPrice } = ordersList[0] as Order

          pool.query(
            'UPDATE orders SET totalPrice=?, tips=?, status=? WHERE id=?',
            [totalPrice + tips, tips, Statuses.Completed, orderId]
          )
            .then(() => res.status(200).json())
            .catch((e) => res.status(500).json(e))
        } else {
          return res.status(400).json('Not found order with Created status')
        }
      })
  } else {
   return res.status(400).json(errors)
  }
}

export {
  BaseOrderValidation,
  WaiterOrderValidation,
  UserPayOrderValidation,
  getOrders,
  createUserOrder,
  editWaiterOrder,
  createWaiterOrder,
  changeOrderStatus,
  getOrderByTable,
  payUserOrder
}
