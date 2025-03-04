import { Router } from "express";

import { getTables } from "../controllers/tablesController";

import { authUser } from "../middleware/authUser";

const router = Router()

router.get('/', authUser, getTables)
export const tablesApi = router
