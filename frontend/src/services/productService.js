import api from "../api/axios";

export const getTopProducts = async () => {
  const res = await api.get("/products/top");
  return res.data;
};
  // Get all products from backend
export const getAllProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};
  // Get a single product using its id
export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};