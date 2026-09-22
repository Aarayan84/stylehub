import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/orders`;

// Create order
export const createOrder = async (orderData) => {
  const response = await axios.post(
    API_URL,
    orderData
  );

  return response.data;
};

// Get all orders
export const getOrders = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Get single order
export const getOrderById = async (id, token) => {
  const response = await axios.get(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Update order status
export const updateOrderStatus = async (
  id,
  status,
  token
) => {
  const response = await axios.put(
    `${API_URL}/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Delete order permanently
export const deleteOrder = async (
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

// Track order
export const trackOrder = async (
  orderId,
  phone
) => {
  const response = await axios.post(
    `${API_URL}/track`,
    {
      orderId,
      phone,
    }
  );

  return response.data;
};