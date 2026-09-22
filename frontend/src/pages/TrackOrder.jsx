import { useState } from "react";
import {
  Check,
  CheckCircle2,
  Clipboard,
  MapPin,
  Package,
  Phone,
  Search,
  Truck,
} from "lucide-react";

import { trackOrder } from "../services/orderService";

const statuses = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
];

function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setOrder(null);
    setCopied(false);

    const trimmedOrderId = orderId.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedOrderId) {
      setError("Please enter your Order ID.");
      return;
    }

    if (!/^\d{10}$/.test(trimmedPhone)) {
      setError(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    try {
      setLoading(true);

      const data = await trackOrder(
        trimmedOrderId,
        trimmedPhone
      );

      setOrder(data.order);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to find your order."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyOrderId = async () => {
    if (!order?._id) return;

    try {
      await navigator.clipboard.writeText(order._id);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const currentStatusIndex = order
    ? statuses.indexOf(order.status)
    : -1;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-sm">
            <Package size={27} />
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
            Sushil Style Hub
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Track Your Order
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Enter your Order ID and phone number to
            check your latest order status.
          </p>
        </div>

        {/* Search Form */}
        <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="orderId"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Order ID
              </label>

              <input
                id="orderId"
                type="text"
                value={orderId}
                onChange={(e) => {
                  setOrderId(e.target.value);
                  setError("");
                }}
                placeholder="Enter your Order ID"
                autoComplete="off"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Phone Number
              </label>

              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10)
                  );
                  setError("");
                }}
                placeholder="Enter 10-digit phone number"
                inputMode="numeric"
                maxLength={10}
                autoComplete="tel"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-5 py-3.5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Search size={17} />

              {loading
                ? "Searching..."
                : "Track Order"}
            </button>
          </form>
        </div>

        {/* Order Result */}
        {order && (
          <div className="mt-6 space-y-5">
            {/* Order Header */}
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
              <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Order ID
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <p className="min-w-0 break-all text-sm font-semibold text-gray-900">
                        {order._id}
                      </p>

                      <button
                        type="button"
                        onClick={copyOrderId}
                        className="flex shrink-0 items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                      >
                        {copied ? (
                          <>
                            <Check size={13} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Clipboard size={13} />
                            Copy
                          </>
                        )}
                      </button>
                    </div>

                    <p className="mt-3 text-xs text-gray-500">
                      Ordered on{" "}
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <span
                    className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-xs font-bold ${
                      order.status === "Delivered"
                        ? "bg-green-50 text-green-700"
                        : order.status === "Cancelled"
                        ? "bg-red-50 text-red-700"
                        : order.status === "Shipped"
                        ? "bg-blue-50 text-blue-700"
                        : order.status === "Confirmed"
                        ? "bg-purple-50 text-purple-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            {order.status !== "Cancelled" ? (
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                    <Truck size={18} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Order Status
                    </h2>

                    <p className="text-xs text-gray-500">
                      Follow your order progress
                    </p>
                  </div>
                </div>

                <div className="mt-7">
                  {statuses.map((status, index) => {
                    const completed =
                      index <= currentStatusIndex;

                    const active =
                      index === currentStatusIndex;

                    return (
                      <div
                        key={status}
                        className="flex gap-4"
                      >
                        {/* Indicator */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                              completed
                                ? "bg-black text-white"
                                : "bg-gray-100 text-gray-400"
                            } ${
                              active
                                ? "ring-4 ring-gray-100"
                                : ""
                            }`}
                          >
                            {completed ? (
                              <Check size={16} />
                            ) : (
                              index + 1
                            )}
                          </div>

                          {index <
                            statuses.length - 1 && (
                            <div
                              className={`h-10 w-px ${
                                index <
                                currentStatusIndex
                                  ? "bg-black"
                                  : "bg-gray-200"
                              }`}
                            />
                          )}
                        </div>

                        {/* Text */}
                        <div className="pb-7 pt-1">
                          <p
                            className={`text-sm font-bold ${
                              completed
                                ? "text-gray-900"
                                : "text-gray-400"
                            }`}
                          >
                            {status}
                          </p>

                          {active && (
                            <p className="mt-1 text-xs text-gray-500">
                              Your order is currently{" "}
                              {status.toLowerCase()}.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <Package
                      size={18}
                      className="text-red-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-red-700">
                      Order Cancelled
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-600">
                      This order has been cancelled and
                      will not be delivered.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Details */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                  <MapPin size={18} />
                </div>

                <h2 className="text-lg font-bold text-gray-900">
                  Delivery Details
                </h2>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="flex gap-3">
                  <Phone
                    size={18}
                    className="mt-0.5 shrink-0 text-gray-400"
                  />

                  <div>
                    <p className="text-xs text-gray-400">
                      Customer
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {order.customer.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {order.customer.phone}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-gray-400"
                  />

                  <div>
                    <p className="text-xs text-gray-400">
                      Delivery Address
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-800">
                      {order.customer.address},{" "}
                      {order.customer.city},{" "}
                      {order.customer.state} -{" "}
                      {order.customer.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                  <Package size={18} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Ordered Products
                  </h2>

                  <p className="text-xs text-gray-500">
                    {order.items.length}{" "}
                    {order.items.length === 1
                      ? "product"
                      : "products"}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.productId}-${item.size}-${index}`}
                    className="flex gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
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

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {item.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                          Size: {item.size}
                        </span>

                        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                          Qty: {item.quantity}
                        </span>
                      </div>

                      <p className="mt-3 text-sm font-bold text-gray-900">
                        ₹
                        {Number(item.price) *
                          Number(item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
                <span className="font-bold text-gray-900">
                  Total
                </span>

                <span className="text-xl font-bold text-gray-900">
                  ₹{order.totalAmount}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default TrackOrder;