import jwt from "jsonwebtoken";
import {NextFunction, Request, Response} from 'express'
import {UserRoles, UserToken} from "../types";

const tokenSecret = process.env.TOKEN_SECRET

export const authUser = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization

  if(!tokenSecret) return res.status(500).json()
  if(!auth) return res.status(401).json()
  if(!auth.includes('Bearer')) return res.status(401).json()

  const token = auth.split(' ')[1]
  try {
    jwt.verify(token, tokenSecret)
    next()
  } catch (_) {
    return res.status(401).json()
  }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization

  if(!tokenSecret) return res.status(500).json()
  if(!auth) return res.status(401).json()
  if(!auth.includes('Bearer')) return res.status(401).json()

  const { role } = jwt.verify(auth.split(' ')[1], tokenSecret) as UserToken

  if(role === UserRoles.Admin) {
    next()
  } else {
    return res.status(403).json('Access denied')
  }
}
