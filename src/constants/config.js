export const API_URL = "http://127.0.0.1:2003/api";

export const API_URL_IMAGE = "http://127.0.0.1:2003";

export const ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",

  // Categories
  CATEGORIES: "/categories",

  // Foods
  FOODS: "/foods",
  TOP_SELLING_FOODS: "/foods/top-selling",

  // Shops
  SHOPS: "/shops",
  SHOP_REGISTER: "/shops/register",

  //Users
  USERS: "/users",
  USER_ME: "/users/me",

  //Orders
  ORDERS: "/orders",
  ORDER_ITEMS: "/orders/items",
  // ORDER_STATUS: "/orders/status",
};

export const STATUS_CODES = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};
