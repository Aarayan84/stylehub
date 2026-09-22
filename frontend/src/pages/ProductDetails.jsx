import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";

import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedSize, setSelectedSize] =
    useState("");

  const [quantity, setQuantity] = useState(1);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] =
    useState("");

  /*
   * =========================
   * Fetch Product
   * =========================
   */

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(id);

        const productData = data.product;

        setProduct(productData);

        /*
         * General products automatically use
         * Free Size.
         *
         * Clothing products use the first
         * available size by default.
         */
        if (productData?.type === "General") {
          setSelectedSize("Free Size");
        } else if (
          productData?.sizes?.length > 0
        ) {
          setSelectedSize(productData.sizes[0]);
        } else {
          setSelectedSize("");
        }

        /*
         * Reset quantity whenever a new product
         * is loaded.
         */
        setQuantity(1);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Product not found"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /*
   * =========================
   * Product Calculations
   * =========================
   */

  const finalPrice = product
    ? Math.round(
        Number(product.price) -
          (Number(product.price) *
            Number(product.discount || 0)) /
            100
      )
    : 0;

  const stock = Number(
    product?.stock || 0
  );

  const isOutOfStock = stock <= 0;

  const isGeneral =
    product?.type === "General";

  /*
   * =========================
   * Quantity
   * =========================
   */

  const handleQuantityChange = (value) => {
    const nextQuantity = Number(value);

    if (!Number.isFinite(nextQuantity)) {
      return;
    }

    setQuantity(
      Math.max(
        1,
        Math.min(nextQuantity, stock)
      )
    );

    setMessage("");
    setMessageType("");
  };

  /*
   * =========================
   * Add To Cart
   * =========================
   *
   * IMPORTANT:
   *
   * CartContext expects:
   *
   * addToCart(product, size, quantity)
   *
   * NOT one object.
   *
   * This fixes the problem where productId
   * and size were not being stored correctly.
   */

  const handleAddToCart = () => {
    setMessage("");
    setMessageType("");

    if (!product) {
      setMessage(
        "Product information is unavailable."
      );

      setMessageType("error");

      return;
    }

    if (isOutOfStock) {
      setMessage(
        "This product is out of stock."
      );

      setMessageType("error");

      return;
    }

    /*
     * General products automatically have
     * Free Size.
     *
     * Clothing products must have a selected
     * size.
     */
    const cartSize = isGeneral
      ? "Free Size"
      : selectedSize;

    if (!cartSize) {
      setMessage(
        "Please select a size."
      );

      setMessageType("error");

      return;
    }

    if (quantity <= 0) {
      setMessage(
        "Please select a valid quantity."
      );

      setMessageType("error");

      return;
    }

    if (quantity > stock) {
      setMessage(
        `Only ${stock} items are available.`
      );

      setMessageType("error");

      return;
    }

    /*
     * CORRECT:
     *
     * Send the actual product object,
     * selected size and quantity.
     *
     * CartContext will create:
     *
     * {
     *   productId,
     *   title,
     *   image,
     *   size,
     *   quantity,
     *   price,
     *   stock
     * }
     */
    addToCart(
      product,
      cartSize,
      quantity
    );

    setMessage(
      "Product added to your cart."
    );

    setMessageType("success");
  };

  /*
   * =========================
   * Loading
   * =========================
   */

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-black" />

          <p className="mt-3 text-sm text-gray-500">
            Loading product...
          </p>
        </div>
      </main>
    );
  }

  /*
   * =========================
   * Error
   * =========================
   */

  if (error || !product) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Product not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            This product may have been removed.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  /*
   * =========================
   * Main UI
   * =========================
   */

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
        >
          <ArrowLeft size={17} />

          Back
        </button>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          {/* =========================
              Product Image
              ========================= */}

          <div className="overflow-hidden rounded-2xl bg-gray-100">
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="aspect-[4/5] h-full w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* =========================
              Product Details
              ========================= */}

          <div className="lg:sticky lg:top-24 lg:h-fit">
            {/* Category / Type */}
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                {product.category}
              </span>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                {isGeneral
                  ? "General Store"
                  : product.gender}
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {product.title}
            </h1>

            {/* Description */}
            <p className="mt-4 text-sm leading-7 text-gray-600">
              {product.description}
            </p>

            {/* =========================
                Price
                ========================= */}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ₹{finalPrice}
              </span>

              {product.discount > 0 && (
                <>
                  <span className="text-base text-gray-400 line-through">
                    ₹{product.price}
                  </span>

                  <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-bold text-green-700">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* =========================
                Stock
                ========================= */}

            <div className="mt-5">
              {isOutOfStock ? (
                <p className="font-semibold text-red-500">
                  Out of Stock
                </p>
              ) : stock <= 5 ? (
                <p className="font-semibold text-orange-500">
                  Only {stock} left
                </p>
              ) : (
                <p className="font-medium text-green-600">
                  In Stock
                </p>
              )}
            </div>

            {/* =========================
                Size
                ========================= */}

            {!isGeneral &&
              product.sizes?.length > 0 && (
                <div className="mt-7">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900">
                      Select Size
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(
                      (size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            setSelectedSize(size);
                            setMessage("");
                            setMessageType("");
                          }}
                          className={`min-w-12 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                            selectedSize === size
                              ? "border-black bg-black text-white"
                              : "border-gray-200 text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {size}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* =========================
                General Product Size
                ========================= */}

            {isGeneral && (
              <div className="mt-7">
                <p className="text-sm font-bold text-gray-900">
                  Product Type
                </p>

                <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-sm font-medium text-gray-700">
                    Free Size
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    This product does not require a clothing size.
                  </p>
                </div>
              </div>
            )}

            {/* =========================
                Quantity
                ========================= */}

            {!isOutOfStock && (
              <div className="mt-7">
                <p className="mb-3 text-sm font-bold text-gray-900">
                  Quantity
                </p>

                <div className="flex w-fit items-center overflow-hidden rounded-lg border border-gray-200">
                  {/* Minus */}
                  <button
                    type="button"
                    onClick={() =>
                      handleQuantityChange(
                        quantity - 1
                      )
                    }
                    disabled={quantity <= 1}
                    className="flex h-11 w-11 items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                  >
                    <Minus size={16} />
                  </button>

                  {/* Quantity */}
                  <span className="flex h-11 w-12 items-center justify-center border-x border-gray-200 text-sm font-bold">
                    {quantity}
                  </span>

                  {/* Plus */}
                  <button
                    type="button"
                    onClick={() =>
                      handleQuantityChange(
                        quantity + 1
                      )
                    }
                    disabled={quantity >= stock}
                    className="flex h-11 w-11 items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* =========================
                Message
                ========================= */}

            {message && (
              <div
                className={`mt-5 rounded-lg px-4 py-3 text-sm ${
                  messageType === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {message}
              </div>
            )}

            {/* =========================
                Add To Cart
                ========================= */}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-black px-6 py-4 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <ShoppingCart size={18} />

              {isOutOfStock
                ? "Out of Stock"
                : "Add to Cart"}
            </button>

            {/* =========================
                Benefits
                ========================= */}

            <div className="mt-7 grid grid-cols-3 gap-3 border-t border-gray-100 pt-6">
              {/* Delivery */}
              <div className="text-center">
                <Truck
                  size={19}
                  className="mx-auto"
                />

                <p className="mt-2 text-[10px] font-semibold text-gray-600 sm:text-xs">
                  Fast Delivery
                </p>
              </div>

              {/* Security */}
              <div className="text-center">
                <ShieldCheck
                  size={19}
                  className="mx-auto"
                />

                <p className="mt-2 text-[10px] font-semibold text-gray-600 sm:text-xs">
                  Secure Shopping
                </p>
              </div>

              {/* Returns */}
              <div className="text-center">
                <RotateCcw
                  size={19}
                  className="mx-auto"
                />

                <p className="mt-2 text-[10px] font-semibold text-gray-600 sm:text-xs">
                  Easy Returns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;
