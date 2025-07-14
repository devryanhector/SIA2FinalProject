// Centralized API endpoints for the dashboard

const API_BASE = ' http://192.168.9.74:3000';

export const API = {
  // Auth
  LOGIN: `${API_BASE}/api/login`,
  REGISTER: `${API_BASE}/api/register`,
  FORGOT_PASSWORD: `${API_BASE}/api/forgot-password`,

  // Products
  GET_ALL_PRODUCTS: `${API_BASE}/getallproducts`,
  GET_PRODUCT: (id) => `${API_BASE}/getproduct/${id}`,
  ADD_PRODUCT: `${API_BASE}/addproduct`,
  EDIT_PRODUCT: `${API_BASE}/editproduct`,
  DELETE_PRODUCT: `${API_BASE}/deleteproduct`,

  // Users
  GET_ALL_USERS: `${API_BASE}/getallusers`,
  GET_USER: (id) => `${API_BASE}/getuser/${id}`,
  EDIT_USER: `${API_BASE}/edituser`,
  DELETE_USER: `${API_BASE}/deleteuser`,

  // Reports
  GET_SALES_REPORT: `${API_BASE}/salesreport`,
  GET_INVENTORY_REPORT: `${API_BASE}/inventoryreport`,

  // Cart (if implemented)
  ADD_TO_CART: `${API_BASE}/cart/add`,
  GET_CART: `${API_BASE}/cart`,
  REMOVE_FROM_CART: `${API_BASE}/cart/remove`,
};

export default API;
