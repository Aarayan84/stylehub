import { useEffect, useState } from "react";
import {
  Eye,
  MapPin,
  Package,
  Phone,
  Trash2,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  getOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../services/orderService";

const statuses = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function getStatusStyle(status) {
  switch (status) {
    case "Confirmed":
      return "bg-purple-50 text-purple-700";

    case "Shipped":
      return "bg-blue-50 text-blue-700";

    case "Delivered":
      return "bg-green-50 text-green-700";

    case "Cancelled":
      return "bg-red-50 text-red-700";

    default:
      return "bg-yellow-50 text-yellow-700";
  }
}

function Orders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingOrderId, setUpdatingOrderId] =
    useState(null);

  const [deletingOrderId, setDeletingOrderId] =
    useState(null);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getOrders(token);

      setOrders(data.orders || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Update order status
  const handleStatusChange = async (
    orderId,
    status
  ) => {
    try {
      setUpdatingOrderId(orderId);
      setError("");

      const data = await updateOrderStatus(
        orderId,
        status,
        token
      );

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? data.order
            : order
        )
      );

      setSelectedOrder((previousOrder) =>
        previousOrder?._id === orderId
          ? data.order
          : previousOrder
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Delete order permanently
  const handleDeleteOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this order? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingOrderId(orderId);
      setError("");

      await deleteOrder(orderId, token);

      // Remove order from current list
      setOrders((previousOrders) =>
        previousOrders.filter(
          (order) => order._id !== orderId
        )
      );

      // Close modal if deleted order was open
      setSelectedOrder((previousOrder) =>
        previousOrder?._id === orderId
          ? null
          : previousOrder
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to delete order"
      );
    } finally {
      setDeletingOrderId(null);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-black" />

          <p className="mt-3 text-sm text-gray-500">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      {/* Header */}
      <div className="px-4 py-5 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            Management
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Orders
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage customer orders and update their
            status.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 sm:mx-6 lg:mx-8">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <Package size={22} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Total Orders
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {orders.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="mx-4 mt-6 rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-100 sm:mx-6 lg:mx-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <Package
              size={28}
              className="text-gray-400"
            />
          </div>

          <h2 className="mt-5 text-lg font-bold text-gray-900">
            No orders yet
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Customer orders will appear here.
          </p>
        </div>
      ) : (
        <div className="px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          {/* ========================= */}
          {/* DESKTOP TABLE */}
          {/* ========================= */}

          <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Items
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Total
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Date
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-100 transition hover:bg-gray-50/70 last:border-0"
                    >
                      {/* Customer */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">
                          {order.customer.name}
                        </p>

                        <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                          <Phone size={12} />
                          {order.customer.phone}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="px-5 py-4">
                        <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                          {order.items.length}{" "}
                          {order.items.length === 1
                            ? "item"
                            : "items"}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-4 text-sm font-bold text-gray-900">
                        ₹{order.totalAmount}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-2">
                          <span
                            className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-bold ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>

                          <select
                            value={order.status}
                            disabled={
                              updatingOrderId ===
                              order._id
                            }
                            onChange={(e) =>
                              handleStatusChange(
                                order._id,
                                e.target.value
                              )
                            }
                            className="w-fit rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {statuses.map(
                              (status) => (
                                <option
                                  key={status}
                                  value={status}
                                >
                                  {status}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-xs text-gray-500">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {/* View */}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedOrder(order)
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                          >
                            <Eye size={15} />
                            View
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteOrder(
                                order._id
                              )
                            }
                            disabled={
                              deletingOrderId ===
                              order._id
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 size={15} />

                            {deletingOrderId ===
                            order._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========================= */}
          {/* MOBILE CARDS */}
          {/* ========================= */}

          <div className="space-y-4 md:hidden">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
              >
                {/* Customer + Total */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-bold text-gray-900">
                      {order.customer.name}
                    </h2>

                    <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                      <Phone size={12} />
                      {order.customer.phone}
                    </div>
                  </div>

                  <span className="shrink-0 text-base font-bold text-gray-900">
                    ₹{order.totalAmount}
                  </span>
                </div>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                      Items
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {order.items.length}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                      Date
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                        }
                      )}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-500">
                      Order Status
                    </label>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <select
                    value={order.status}
                    disabled={
                      updatingOrderId === order._id
                    }
                    onChange={(e) =>
                      handleStatusChange(
                        order._id,
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium outline-none focus:border-black disabled:opacity-50"
                  >
                    {statuses.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile Actions */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {/* View */}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedOrder(order)
                    }
                    className="flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
                  >
                    <Eye size={16} />
                    View
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteOrder(order._id)
                    }
                    disabled={
                      deletingOrderId ===
                      order._id
                    }
                    className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={16} />

                    {deletingOrderId ===
                    order._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* ORDER DETAILS MODAL */}
      {/* ========================= */}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 p-0 backdrop-blur-[2px] sm:items-center sm:justify-center sm:p-4">
          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:max-w-2xl sm:rounded-2xl sm:p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Order Details
                </p>

                <h2 className="mt-1 text-lg font-bold text-gray-900">
                  Customer Order
                </h2>

                <p className="mt-1 break-all text-xs text-gray-400">
                  {selectedOrder._id}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100"
                aria-label="Close order details"
              >
                <X size={20} />
              </button>
            </div>

            {/* Customer Information */}
            <div className="mt-6 rounded-xl bg-gray-50 p-4">
              <h3 className="text-sm font-bold text-gray-900">
                Customer Information
              </h3>

              <div className="mt-4 space-y-4">
                {/* Name */}
                <div>
                  <p className="text-xs text-gray-400">
                    Name
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {selectedOrder.customer.name}
                  </p>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone
                    size={16}
                    className="mt-0.5 shrink-0 text-gray-400"
                  />

                  <div>
                    <p className="text-xs text-gray-400">
                      Phone
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {selectedOrder.customer.phone}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0 text-gray-400"
                  />

                  <div>
                    <p className="text-xs text-gray-400">
                      Delivery Address
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-800">
                      {selectedOrder.customer.address},{" "}
                      {selectedOrder.customer.city},{" "}
                      {selectedOrder.customer.state} -{" "}
                      {selectedOrder.customer.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ordered Products */}
            <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-900">
                Ordered Products
              </h3>

              <div className="mt-3 space-y-3">
                {selectedOrder.items.map(
                  (item, index) => (
                    <div
                      key={`${item.productId}-${item.size}-${index}`}
                      className="flex gap-3 rounded-xl border border-gray-100 p-3"
                    >
                      {/* Product Image */}
                      <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {item.title}
                        </h4>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                            Size: {item.size}
                          </span>

                          <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                            Qty: {item.quantity}
                          </span>

                          <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                            ₹{item.price}
                          </span>
                        </div>

                        <p className="mt-2 text-sm font-bold text-gray-900">
                          ₹
                          {Number(item.price) *
                            Number(item.quantity)}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Status + Total */}
            <div className="mt-6 border-t border-gray-100 pt-5">
              {/* Status */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-500">
                  Update Order Status
                </label>

                <select
                  value={selectedOrder.status}
                  disabled={
                    updatingOrderId ===
                    selectedOrder._id
                  }
                  onChange={(e) =>
                    handleStatusChange(
                      selectedOrder._id,
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm font-medium outline-none focus:border-black disabled:opacity-50"
                >
                  {statuses.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Total */}
              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
                <span className="font-bold text-gray-900">
                  Total Amount
                </span>

                <span className="text-xl font-bold text-gray-900">
                  ₹{selectedOrder.totalAmount}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {/* Close */}
              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Close
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() =>
                  handleDeleteOrder(
                    selectedOrder._id
                  )
                }
                disabled={
                  deletingOrderId ===
                  selectedOrder._id
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={16} />

                {deletingOrderId ===
                selectedOrder._id
                  ? "Deleting..."
                  : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;