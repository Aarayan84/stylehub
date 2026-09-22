import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Check,
  CheckCircle2,
  Copy,
  Home,
  ShoppingBag,
  Truck,
} from "lucide-react";

function OrderSuccess() {
  const { id } = useParams();

  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(id);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy Order ID:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:py-20">
      <div className="mx-auto max-w-lg">
        {/* Success Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2
            size={42}
            className="text-green-600"
          />
        </div>

        {/* Heading */}
        <div className="mt-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600">
            Order Confirmed
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Order Placed Successfully!
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Thank you for shopping with StyleHub.
            Your order has been received and is now being
            processed.
          </p>
        </div>

        {/* Order Details */}
        <div className="mt-7 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          {/* Order ID */}
          <div className="p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Your Order ID
            </p>

            <div className="mt-3 flex items-center gap-2 rounded-lg bg-gray-50 p-3">
              <p className="min-w-0 flex-1 break-all text-sm font-semibold text-gray-900">
                {id}
              </p>

              <button
                type="button"
                onClick={handleCopyOrderId}
                className="flex shrink-0 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Status */}
            <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-50">
                <Truck
                  size={18}
                  className="text-yellow-600"
                />
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Current Status
                </p>

                <p className="mt-0.5 text-sm font-bold text-yellow-600">
                  Pending
                </p>
              </div>
            </div>
          </div>

          {/* Tracking Information */}
          <div className="border-t border-gray-100 bg-gray-50 p-5 sm:p-6">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
                <ShoppingBag
                  size={17}
                  className="text-gray-700"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Track your order
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Keep your Order ID and phone number
                  handy to check your order status anytime.
                </p>

                <Link
                  to="/track-order"
                  className="mt-3 inline-flex text-sm font-semibold text-black underline underline-offset-4"
                >
                  Track Order →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/products"
            className="flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            <ShoppingBag size={17} />
            Continue Shopping
          </Link>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <Home size={17} />
            Go Home
          </Link>
        </div>

        {/* Note */}
        <p className="mt-6 text-center text-xs leading-5 text-gray-400">
          Please save your Order ID for future tracking.
        </p>
      </div>
    </main>
  );
}

export default OrderSuccess;