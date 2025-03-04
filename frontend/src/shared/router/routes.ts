export const adminPaths = {
  adminMain: {
    icon: 'fas fa-home',
    isAdmin: false,
    path: '/admin',
    title: 'Главная'
  },
  adminMenu: {
    icon: 'fas fa-th',
    isAdmin: true,
    path: '/admin/menu',
    title: 'Меню'
  },
  adminOrders: {
    icon: 'fas fa-dollar-sign',
    isAdmin: false,
    path: '/admin/orders',
    title: 'Заказы'
  },
  adminProducts: {
    icon: 'fas fa-pizza-slice',
    isAdmin: true,
    path: '/admin/products',
    title: 'Продукты'
  },
  adminUsers: {
    icon: 'fas fa-users',
    isAdmin: true,
    path: '/admin/users',
    title: 'Пользователи'
  }
};

const sigUserPaths = {
  main: {
    icon: 'fas fa-home',
    path: '/',
    title: 'Главная'
  },
  menu: {
    icon: 'fas fa-pizza-slice',
    path: '/menu',
    title: 'Меню'
  },
  cart: {
    icon: 'fas fa-shopping-cart',
    path: '/cart',
    title: 'Корзина'
  },
  order: {
    icon: 'fas fa-wallet',
    path: '/order',
    title: 'Оплата стола'
  }
};
export const userPaths = sigUserPaths;

export const paths = {
  login: {
    path: '/login',
    title: 'Логин'
  },
  ...adminPaths,
  ...userPaths
};
