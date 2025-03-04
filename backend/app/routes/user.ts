import { Router } from "express";

import {
  UserCreateValidation,
  UserEditValidation,
  UserValidation,
  createUser,
  deleteUser,
  editUser,
  getUsers,
  loginUser,
} from '../controllers/userController'
import { authUser, isAdmin } from "../middleware/authUser";

const router = Router()

router.get('/', authUser, isAdmin, getUsers)
router.post('/create', authUser, isAdmin, UserCreateValidation, createUser)
router.put('/:userId', authUser, isAdmin, UserEditValidation, editUser)
router.post('/login', UserValidation, loginUser)
router.delete('/:userId', authUser, isAdmin, deleteUser)

export const userApi = router
