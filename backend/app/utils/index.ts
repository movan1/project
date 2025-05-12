import jwt from "jsonwebtoken";
import 'dotenv/config'

import { UserRoles } from "../types";
import { genSalt, hash } from "bcrypt";

export const generateUserToken = (id: number, name: string, role: UserRoles): string | null => {
  const payload = { id, name, role }
  const tokenSecret = process.env.TOKEN_SECRET

  if(tokenSecret) {
    return jwt.sign(payload, tokenSecret, { expiresIn: '30 days'})
  }

  return null
}

export const generatePassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  return await hash(password, salt);
}

export const convertFromHTMLToNormal = (x: string): string => {
  return x
    .replace(/&quot;/g, '\"')
    .replace(/&#x2F;/g, '/')
}

export const getDateForDB = (): string => {
  return new Date().toISOString();
}
