import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const finalPrice =
    Number(product.price) -
    (Number(product.price) *
      Number(product.discount || 0)) /
      100;

  const isOutOfStock =
    Number(product.stock) <= 0;

  const isGeneral =
    product.type === "General";

  return (
    <Link
      to={`/products/${product._id}`}
      className="group block overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
              isOutOfStock
                ? "opacity-70"
                : ""
            }`}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No Image
          </div>
        )}

        {product.discount > 0 &&
          !isOutOfStock && (
            <span className="absolute left-2 top-2 rounded-md bg-green-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white sm:text-xs">
              {product.discount}% OFF
            </span>
          )}

        {isGeneral && (
          <span className="absolute right-2 top-2 rounded-md bg-white/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-700 shadow-sm">
            General
          </span>
        )}

        {isOutOfStock && (
          <span className="absolute inset-x-0 bottom-0 bg-black/75 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white">
            Out of Stock
          </span>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 sm:text-xs">
          {product.category}
        </p>

        <h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-gray-900 sm:min-h-[44px] sm:text-base">
          {product.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-base font-bold text-gray-900 sm:text-lg">
            ₹{Math.round(finalPrice)}
          </span>

          {product.discount > 0 && (
            <span className="text-xs text-gray-400 line-through sm:text-sm">
              ₹{product.price}
            </span>
          )}
        </div>

        <div className="mt-2">
          {isOutOfStock ? (
            <p className="text-xs font-medium text-red-500">
              Currently unavailable
            </p>
          ) : Number(product.stock) <= 5 ? (
            <p className="text-xs font-medium text-orange-500">
              Only {product.stock} left
            </p>
          ) : (
            <p className="text-xs font-medium text-gray-400">
              In stock
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;