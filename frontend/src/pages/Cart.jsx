import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    totalItems,
    totalPrice,
  } = useCart();

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-100">
            <ShoppingBag
              size={32}
              className="text-gray-400"
            />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Looks like you haven't added anything to
            your cart yet. Explore our collection and
            find something you love.
          </p>

          <Link
            to="/products"
            className="mt-7 inline-flex items-center justify-center rounded-lg bg-black px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Shopping Cart
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {totalItems}{" "}
            {totalItems === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_350px] lg:items-start">
          {/* Cart Items */}
          <div className="space-y-4">
            {cartItems.map((item) => {
              const itemTotal =
                Number(item.price || 0) *
                Number(item.quantity || 0);

              const stock = Number(item.stock || 0);

              return (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-5"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <Link
                      to={`/products/${item.productId}`}
                      className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-36 sm:w-28"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover transition hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </Link>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            to={`/products/${item.productId}`}
                            className="line-clamp-2 text-sm font-semibold text-gray-900 hover:text-gray-600 sm:text-base"
                          >
                            {item.title}
                          </Link>

                          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                            Size:{" "}
                            <span className="font-medium text-gray-700">
                              {item.size}
                            </span>
                          </p>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              item.productId,
                              item.size
                            )
                          }
                          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                          aria-label={`Remove ${item.title}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="mt-3">
                        <span className="text-base font-bold text-gray-900">
                          ₹{item.price}
                        </span>

                        {item.originalPrice &&
                          Number(item.originalPrice) >
                            Number(item.price) && (
                            <span className="ml-2 text-xs text-gray-400 line-through sm:text-sm">
                              ₹{item.originalPrice}
                            </span>
                          )}
                      </div>

                      {/* Bottom row */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        {/* Quantity */}
                        <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.size,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={15} />
                          </button>

                          <span className="flex h-9 min-w-10 items-center justify-center border-x border-gray-200 text-sm font-semibold text-gray-900">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.size,
                                item.quantity + 1
                              )
                            }
                            disabled={
                              item.quantity >= stock
                            }
                            className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        {/* Item total */}
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            Item total
                          </p>

                          <p className="text-sm font-bold text-gray-900">
                            ₹{itemTotal}
                          </p>
                        </div>
                      </div>

                      {/* Stock warning */}
                      {stock > 0 && stock <= 5 && (
                        <p className="mt-3 text-xs font-medium text-orange-500">
                          Only {stock} left in stock
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Continue Shopping */}
            <Link
              to="/products"
              className="inline-flex items-center text-sm font-semibold text-gray-700 transition hover:text-black"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-6">
            <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
              <h2 className="text-lg font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Items
                  </span>

                  <span className="font-medium text-gray-900">
                    {totalItems}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-gray-900">
                    ₹{totalPrice}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Delivery
                  </span>

                  <span className="font-semibold text-green-600">
                    FREE
                  </span>
                </div>
              </div>

              <div className="my-5 border-t border-gray-100" />

              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">
                  Total
                </span>

                <span className="text-xl font-bold text-gray-900">
                  ₹{totalPrice}
                </span>
              </div>

              <Link
                to="/checkout"
                className="mt-5 flex w-full items-center justify-center rounded-lg bg-black px-5 py-3.5 text-sm font-bold text-white transition hover:bg-gray-800"
              >
                Proceed to Checkout
              </Link>

              <p className="mt-3 text-center text-xs text-gray-400">
                Secure checkout • Free delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Cart;