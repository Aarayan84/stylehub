import { Link } from "react-router-dom";
import { Home, ShoppingBag } from "lucide-react";

function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* 404 */}
        <p className="text-7xl font-black tracking-tight text-gray-900 sm:text-8xl">
          404
        </p>

        <h1 className="mt-5 text-2xl font-bold text-gray-900 sm:text-3xl">
          Page Not Found
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
          Sorry, the page you are looking for doesn't
          exist or may have been moved.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            <Home size={17} />
            Go Home
          </Link>

          <Link
            to="/products"
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <ShoppingBag size={17} />
            Shop Products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;