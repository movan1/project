import { Router } from "express";

import {
  getTables,
  getFreeTables
} from "../controllers/tablesController";

import { authUser } from "../middleware/authUser";

const router = Router()

router.get('/', authUser, getTables)
router.get('/free', getFreeTables)
export const tablesApi = router
