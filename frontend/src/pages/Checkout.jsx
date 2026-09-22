import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  MapPin,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService";

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      navigate("/cart", { replace: true });
    }
  }, [cartItems.length, orderPlaced, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 10);

    setFormData((previousData) => ({
      ...previousData,
      phone: value,
    }));

    setError("");
  };

  const handlePincodeChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 6);

    setFormData((previousData) => ({
      ...previousData,
      pincode: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (loading) {
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    if (!formData.address.trim()) {
      setError("Please enter your address.");
      return;
    }

    if (!formData.city.trim()) {
      setError("Please enter your city.");
      return;
    }

    if (!formData.state.trim()) {
      setError("Please enter your state.");
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        customer: {
          name: formData.name.trim(),
          phone: formData.phone,
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode,
        },

        items: cartItems.map((item) => ({
          productId: item.productId,
          title: item.title,
          image: item.image,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const data = await createOrder(orderData);

      setOrderPlaced(true);

      clearCart();

      navigate(`/order-success/${data.order._id}`);
    } catch (error) {
      console.error("Order creation error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to place your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {/* Header */}
        <div className="mb-7">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black"
          >
            <ArrowLeft size={17} />
            Back to Cart
          </Link>

          <div className="mt-5">
            <div className="flex items-center gap-2">
              <Lock size={17} className="text-gray-500" />

              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Secure Checkout
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Checkout
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Enter your delivery details to place your
              order.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          {/* Delivery Form */}
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-7">
            {/* Section Header */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <MapPin size={19} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Delivery Details
                </h2>

                <p className="text-xs text-gray-500">
                  Where should we deliver your order?
                </p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Full Name
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Phone Number
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="10-digit phone number"
                  inputMode="numeric"
                  maxLength={10}
                  autoComplete="tel"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                />

                <p className="mt-1.5 text-xs text-gray-400">
                  We'll use this number for order updates.
                </p>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Delivery Address
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House number, street, locality"
                  rows={3}
                  autoComplete="street-address"
                  className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* City + State */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="city"
                    className="mb-1.5 block text-sm font-semibold text-gray-700"
                  >
                    City
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    autoComplete="address-level2"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="mb-1.5 block text-sm font-semibold text-gray-700"
                  >
                    State
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    autoComplete="address-level1"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label
                  htmlFor="pincode"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Pincode
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  value={formData.pincode}
                  onChange={handlePincodeChange}
                  placeholder="6-digit pincode"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="postal-code"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Payment Method */}
              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-sm font-bold text-gray-900">
                  Payment Method
                </h2>

                <div className="mt-3 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                    <CheckCircle2
                      size={18}
                      className="text-green-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Cash on Delivery
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Pay when your order arrives.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-5 py-3.5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Lock size={16} />

                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

              <p className="text-center text-xs leading-5 text-gray-400">
                By placing your order, you agree to our
                shopping terms and conditions.
              </p>
            </form>
          </div>

          {/* Order Summary */}
          <aside className="h-fit lg:sticky lg:top-6">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <ShoppingBag size={19} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Order Summary
                  </h2>

                  <p className="text-xs text-gray-500">
                    {totalItems}{" "}
                    {totalItems === 1
                      ? "item"
                      : "items"}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="mt-5 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex gap-3"
                  >
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
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

                      <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-bold text-white">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium text-gray-900">
                        {item.title}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Size: {item.size}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-gray-900">
                      ₹
                      {Number(item.price || 0) *
                        Number(item.quantity || 0)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-6 border-t border-gray-100 pt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-gray-900">
                    ₹{totalPrice}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Delivery
                  </span>

                  <span className="font-semibold text-green-600">
                    FREE
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="font-bold text-gray-900">
                    Total
                  </span>

                  <span className="text-xl font-bold text-gray-900">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="mt-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <div className="flex gap-3">
                <Truck
                  size={18}
                  className="mt-0.5 shrink-0 text-gray-600"
                />

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Free Delivery
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Your order will be delivered to the
                    address provided above.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Checkout;