
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/products`;

// Get all products
export const getProducts = async () => {
  const response = await axios.get(API_URL);

  return response.data;
};

// Get one product
export const getProductById = async (id) => {
  const response = await axios.get(
    `${API_URL}/${id}`
  );

  return response.data;
};

// Create product
export const createProduct = async (
  formData,
  token
) => {
  const response = await axios.post(
    API_URL,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Update product
export const updateProduct = async (
  id,
  formData,
  token
) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Delete product
export const deleteProduct = async (
  id,
  token
) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
