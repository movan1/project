import { JwtPayload } from "jsonwebtoken";

export type User = {
  name: string,
  password: string
}

export type FullUser = User & {
  role: UserRoles
}

export type UserToken = {
  id: number
  name: string
  role: UserRoles
} & JwtPayload

export enum UserRoles {
  User = 1,
  Admin = 2
}
