import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { getProducts } from "../../services/productService";
import { getOrders } from "../../services/orderService";

function Dashboard() {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productData, orderData] = await Promise.all([
          getProducts(),
          getOrders(token),
        ]);

        const productList = productData.products || [];
        const orderList = orderData.orders || [];

        setProducts(productList);
        setTotalOrders(orderList.length);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  // Calculate dashboard statistics
  const totalProducts = products.length;

  const totalCategories = new Set(
    products.map((product) => product.category)
  ).size;

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.stock || 0),
    0
  );

  const discountedProducts = products.filter(
    (product) =>
      Number(product.discount || 0) > 0
  ).length;

  const stats = [
    {
      title: "Products",
      value: totalProducts,
      description: "Total products",
    },
    {
      title: "Categories",
      value: totalCategories,
      description: "Active categories",
    },
    {
      title: "Stock",
      value: totalStock,
      description: "Total available items",
    },
    {
      title: "Discounted",
      value: discountedProducts,
      description: "Products on discount",
    },
    {
      title: "Orders",
      value: totalOrders,
      description: "Total customer orders",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Overview of your StyleHub store.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-6"
            >
              <p className="text-sm font-medium text-gray-500">
                {stat.title}
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                {loading ? "—" : stat.value}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Products */}
        <div className="mt-6 rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b border-gray-100 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Recently added products in your store.
            </p>
          </div>

          {loading ? (
            <div className="p-6 text-center text-sm text-gray-500">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">
              No products available.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {products.slice(0, 5).map((product) => {
                const finalPrice =
                  Number(product.price) -
                  (Number(product.price) *
                    Number(product.discount || 0)) /
                    100;

                return (
                  <div
                    key={product._id}
                    className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5"
                  >
                    {/* Image */}
                    <div className="h-14 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-16 sm:w-14">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-gray-900">
                        {product.title}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {product.category}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        ₹{Math.round(finalPrice)}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Stock: {product.stock}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;