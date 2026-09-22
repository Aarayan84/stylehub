import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  deleteProduct,
  getProducts,
} from "../../services/productService";

import { useAuth } from "../../context/AuthContext";

function AdminProducts() {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();

      setProducts(data.products);
    } catch (error) {
      console.error(error);

      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [products, search]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id, token);

      setProducts((previousProducts) =>
        previousProducts.filter(
          (product) => product._id !== id
        )
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to delete product."
      );
    }
  };

  const calculateFinalPrice = (product) => {
    return Math.round(
      product.price -
        (product.price * product.discount) / 100
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Products
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your clothing products.
            </p>
          </div>

          <Link
            to="/admin/products/add"
            className="rounded-lg bg-black px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            + Add Product
          </Link>

        </div>

        {/* Search */}
        <div className="mt-6">
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black sm:max-w-md"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="mt-10 text-center text-sm text-gray-500">
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-6 rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">
              No products found.
            </p>
          </div>
        ) : (

          <div className="mt-6 space-y-3">

            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
              >

                {/* Mobile/Desktop Layout */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                  {/* Image */}
                  <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product info */}
                  <div className="min-w-0 flex-1">

                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      {product.category}
                    </p>

                    <h2 className="mt-1 truncate text-base font-semibold text-gray-900">
                      {product.title}
                    </h2>

                    <div className="mt-2 flex flex-wrap items-center gap-2">

                      <span className="font-bold text-gray-900">
                        ₹{calculateFinalPrice(product)}
                      </span>

                      <span className="text-sm text-gray-400 line-through">
                        ₹{product.price}
                      </span>

                      {product.discount > 0 && (
                        <span className="text-xs font-semibold text-green-600">
                          {product.discount}% OFF
                        </span>
                      )}

                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      Stock: {product.stock} • Sizes:{" "}
                      {product.sizes.join(", ")}
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 sm:flex-col lg:flex-row">

                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 sm:flex-none"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(product._id)
                      }
                      className="flex-1 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 sm:flex-none"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default AdminProducts;