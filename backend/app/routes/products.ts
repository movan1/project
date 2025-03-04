import { Router } from "express";

import {
  getProducts,
  ProductValidation,
  addProduct,
  editProduct,
  deleteProduct, getProductsByIDs
} from '../controllers/productsController'

import { authUser, isAdmin } from "../middleware/authUser";
import { isAvailableProducts } from "../middleware/order";

const router = Router()

router.get('/', authUser, getProducts)
router.post('/', authUser, isAdmin, ProductValidation, addProduct)
router.post('/products', isAvailableProducts, getProductsByIDs)
router.put('/:productId', authUser, isAdmin, ProductValidation, editProduct)
router.delete('/:productId', authUser, isAdmin, deleteProduct)

export const productsApi = router
