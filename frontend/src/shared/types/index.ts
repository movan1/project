export type {
  MenuSection, MenuSectionAdmin, MenuSectionItem
} from './menu';

export type { NewWaiterOrder, Order } from './order';
export { OrderType, Statuses } from './order';

export type { Product, ProductWithoutID } from './product';
export { WeightType } from './product';

export type { Table } from './tables';

export type {
  EditableUser, FullUser, JWTToken, User, UserToken, UserWithId
} from './user';

export { UserRoles } from './user';

export type HasId = { id: number };
