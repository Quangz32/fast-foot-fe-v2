export const API_URL = 'http://localhost:2003/api';

export const API_URL_IMAGE = 'http://localhost:2003';

export const ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',

  CATEGORIES: '/categories',

  FOODS: '/foods',
  TOP_SELLING_FOODS: '/foods/top-selling',
};

export const STATUS_CODES = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
}; 