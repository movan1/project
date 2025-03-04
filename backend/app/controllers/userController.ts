import { Request, Response } from "express";
import { compare } from "bcrypt";
import { check, validationResult } from "express-validator";

import { pool } from "../config";
import { User, FullUser, UserRoles, HasId } from "../types";
import {generatePassword, generateUserToken} from "../utils";

const UserValidation = [
  check('name').exists().escape().trim().not().isEmpty().isString(),
  check('password').exists().escape().trim().not().isEmpty().isString(),
]

const UserCreateValidation = [
  ...UserValidation,
  check('role').exists().not().isEmpty().isIn(Object.values(UserRoles)),
]

const UserEditValidation = [
  UserValidation[0],
  check('password').optional().escape().trim().isString(),
]

const getUsers = async (_: Request, res: Response) => {
  pool.query('SELECT id, name, role FROM users')
    .then(data => res.status(200).json(data[0]))
    .catch(() => res.status(500).json('Error while read users'))
}

const createUser = async (req: Request, res: Response) => {
  const errors = validationResult(req)

  if(errors.isEmpty()) {
    const {
      name,
      password,
      role
    } = req.body as FullUser

    const hashPassword = await generatePassword(password);

    pool.query(
      'INSERT INTO users (name, password, role) VALUES (?, ?, ?)',
      [name, hashPassword, role]
    )
      .then((x) => {
        // @ts-ignore
        const token = generateUserToken(x[0].insertId, name, role)
        return res.status(200).send({token})
      })
      .catch((_) => res.status(500).send('Error while add new user'))

  } else {
    return res.status(400).json(errors)
  }
}

const editUser = async (req: Request, res: Response) => {
  const userID = req.params.userId
  const errors = validationResult(req);

  if(userID) {
    const [data] = await pool.query('SELECT * FROM users WHERE id=?', [userID])
    if(Array.isArray(data) && data.length > 0) {
      if(errors.isEmpty()) {
        const {
          name,
          password,
          role
        } = req.body as FullUser;

        if(password.trim().length > 0) {
          const hashPassword = await generatePassword(password)
          pool.query('UPDATE users SET name=?, password=?, role=? WHERE id=?', [name, hashPassword, role, userID])
            .then(() => res.status(200).json())
            .catch(() => res.status(500).json('Error while update user with pass'))
        } else {
          pool.query('UPDATE users SET name=?, role=? WHERE id=?', [name, role, userID])
            .then(() => res.status(200).json())
            .catch(() => res.status(500).json('Error while update user'))
        }
      } else {
        return res.status(400).json(errors)
      }
    } else {
      return res.status(400).json(`Not found user with id: ${userID}`)
    }
  }
}

const deleteUser = async (req: Request, res: Response) => {
  const userID = req.params.userId

  if(userID) {
    const [data] = await pool.query('SELECT * FROM users WHERE id=?', [userID])
    if(Array.isArray(data) && data.length > 0) {
      pool.query('DELETE FROM users WHERE id=?', [userID])
        .then(() => res.status(200).json())
        .catch(() => res.status(500).json('Error while delete user'))
    } else {
      return res.status(400).json(`Not found user with id: ${userID}`)
    }
  }
}

const loginUser = async (req: Request, res: Response) => {
  const errors = validationResult(req)

  if(errors.isEmpty()) {
    const {
      name,
      password
    } = req.body as User

    pool.query('SELECT * FROM users WHERE name=?', [name])
      .then(async (data) => {
        if(Array.isArray(data[0]) && data[0].length > 0) {
          const user = data[0][0] as FullUser & HasId

          const validPass = await compare(password, user.password);
          const token = generateUserToken(user.id, user.name, user.role)

          if(validPass && token) {
            return res.status(200).send({ token })
          } else {
            return res.status(400).json('Incorrect name or pass')
          }
        } else {
          return res.status(400).json('No find user with this name')
        }
      })
      .catch(() => res.status(500).json('Error while select user'))
  } else {
    return res.status(400).json(errors)
  }
}

export {
  UserValidation,
  UserCreateValidation,
  UserEditValidation,
  getUsers,
  createUser,
  editUser,
  loginUser,
  deleteUser
}
