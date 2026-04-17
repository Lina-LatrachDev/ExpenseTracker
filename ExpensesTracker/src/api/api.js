import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Add token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH 
export const signup = (userData) => API.post("/auth/signup", userData);
export const login = (userData) => API.post("/auth/login", userData);

// TRANSACTIONS
export const getTransactions = (page = 1, limit = 50) => 
  API.get(`/transactions?page=${page}&limit=${limit}`);

export const addTransaction = (transactionData) => 
  API.post("/transactions", transactionData);

export const updateTransaction = (id, transactionData) => 
  API.put(`/transactions/${id}`, transactionData);

export const deleteTransaction = (id) => 
  API.delete(`/transactions/${id}`);

// CATEGORIES
export const getCategories = () => API.get("/categories");

export const addCategory = (categoryData) => 
  API.post("/categories", categoryData);

export const updateCategory = (id, categoryData) => 
  API.put(`/categories/${id}`, categoryData);

export const deleteCategory = (id) => 
  API.delete(`/categories/${id}`);


// ADMIN VIEW USER DATA
export const getUserTransactions = (userId) =>
  API.get(`/transactions/user/${userId}`);

export const getUserCategories = (userId) =>
  API.get(`/categories/user/${userId}`);

// ADMIN GETS USERS
export const getUsers = ({ search = "", role = "", page = 1, limit = 10 } = {}) =>
  API.get("/users", {
    params: { search, role, page, limit }
  });

export const getAdminDashboard = () => API.get("/users/admin-dashboard");
export const getUserById = (id) => API.get(`/users/${id}`);
export const updateUserRole = (id, role) => API.patch(`/users/${id}/role`, { role });

// ADMIN DELETES USERS
export const deleteUser = (id) => API.delete(`/users/${id}`);

// BANK FEED
export const fetchBankTransactions = () => API.get("/bank/fetch-external");

export default API;
