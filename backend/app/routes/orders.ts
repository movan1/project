import { Router } from "express";
import { authUser } from "../middleware/authUser";
import {
  BaseOrderValidation,
  WaiterOrderValidation,
  getOrders,
  getOrdersByIds,
  payUserOrder,
  createUserOrder,
  editWaiterOrder,
  getOrderByTable,
  createWaiterOrder,
  changeOrderStatus,
} from "../controllers/orderController";
import { isAvailableProducts } from "../middleware/order";

const router = Router()

router.get('/', authUser, getOrders)
router.post('/ordersById', getOrdersByIds)
router.get('/:tableId', getOrderByTable)
router.patch('/:orderId', payUserOrder)
router.post('/', BaseOrderValidation, isAvailableProducts, createUserOrder)
router.post('/admin', authUser, WaiterOrderValidation, isAvailableProducts, createWaiterOrder)
router.patch('/admin/:orderId', authUser, WaiterOrderValidation, isAvailableProducts, editWaiterOrder)
router.patch('/admin/status/:orderId', changeOrderStatus)

export const ordersApi = router
