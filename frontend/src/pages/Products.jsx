import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";

import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

function Products() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [type, setType] = useState(
    searchParams.get("type") || "All"
  );

  const [gender, setGender] = useState(
    searchParams.get("gender") || "All"
  );

  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );

  const [sort, setSort] = useState("default");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        setProducts(data.products || []);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const urlType =
      searchParams.get("type") || "All";

    const urlGender =
      searchParams.get("gender") || "All";

    const urlCategory =
      searchParams.get("category") || "All";

    setType(urlType);
    setGender(urlGender);
    setCategory(urlCategory);
  }, [searchParams]);

  const updateFilters = ({
    nextType = type,
    nextGender = gender,
    nextCategory = category,
  }) => {
    const params = {};

    if (nextType !== "All") {
      params.type = nextType;
    }

    if (
      nextGender !== "All" &&
      nextType !== "General"
    ) {
      params.gender = nextGender;
    }

    if (nextCategory !== "All") {
      params.category = nextCategory;
    }

    setSearchParams(params);
  };

  const clothingCategories = useMemo(() => {
    return [
      ...new Set(
        products
          .filter(
            (product) =>
              product.type === "Clothing"
          )
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ].sort();
  }, [products]);

  const generalCategories = useMemo(() => {
    return [
      ...new Set(
        products
          .filter(
            (product) =>
              product.type === "General"
          )
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ].sort();
  }, [products]);

  const categories =
    type === "General"
      ? generalCategories
      : type === "Clothing"
      ? clothingCategories
      : [
          ...new Set(
            products
              .map((product) => product.category)
              .filter(Boolean)
          ),
        ].sort();

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (type !== "All") {
      result = result.filter(
        (product) => product.type === type
      );
    }

    if (
      gender !== "All" &&
      type !== "General"
    ) {
      result = result.filter(
        (product) => product.gender === gender
      );
    }

    if (category !== "All") {
      result = result.filter(
        (product) =>
          product.category === category
      );
    }

    if (search.trim()) {
      const searchValue =
        search.toLowerCase();

      result = result.filter((product) =>
        `${product.title} ${product.category} ${
          product.description || ""
        }`
          .toLowerCase()
          .includes(searchValue)
      );
    }

    if (sort === "price-low") {
      result.sort(
        (a, b) =>
          getFinalPrice(a) -
          getFinalPrice(b)
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) =>
          getFinalPrice(b) -
          getFinalPrice(a)
      );
    }

    if (sort === "discount") {
      result.sort(
        (a, b) =>
          Number(b.discount || 0) -
          Number(a.discount || 0)
      );
    }

    return result;
  }, [
    products,
    type,
    gender,
    category,
    search,
    sort,
  ]);

  const clearFilters = () => {
    setSearch("");
    setSort("default");

    setType("All");
    setGender("All");
    setCategory("All");

    setSearchParams({});
  };

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-black" />

          <p className="mt-3 text-sm text-gray-500">
            Loading products...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="px-4 py-12">
        <div className="mx-auto max-w-xl rounded-xl bg-red-50 p-6 text-center text-sm text-red-600">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white">
      {/* Header */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
            Sushil Style Hub
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            Shop Everything
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Explore clothing, household essentials,
            kitchen products, toys, and everyday
            useful items.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={17} />

            <p className="text-sm font-bold text-gray-900">
              Filters
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {/* Search */}
            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search products..."
              className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black"
            />

            {/* Type */}
            <select
              value={type}
              onChange={(e) => {
                const nextType =
                  e.target.value;

                setType(nextType);
                setGender(
                  nextType === "General"
                    ? "All"
                    : gender
                );
                setCategory("All");

                updateFilters({
                  nextType,
                  nextGender:
                    nextType === "General"
                      ? "All"
                      : gender,
                  nextCategory: "All",
                });
              }}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-black"
            >
              <option value="All">
                All Products
              </option>
              <option value="Clothing">
                Clothing
              </option>
              <option value="General">
                General Store
              </option>
            </select>

            {/* Gender */}
            {type !== "General" ? (
              <select
                value={gender}
                onChange={(e) => {
                  const value = e.target.value;

                  setGender(value);

                  updateFilters({
                    nextGender: value,
                  });
                }}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-black"
              >
                <option value="All">
                  All Genders
                </option>
                <option value="Men">Men</option>
                <option value="Women">
                  Women
                </option>
                <option value="Kids">
                  Kids
                </option>
              </select>
            ) : (
              <div className="hidden lg:block" />
            )}

            {/* Category */}
            <select
              value={category}
              onChange={(e) => {
                const value = e.target.value;

                setCategory(value);

                updateFilters({
                  nextCategory: value,
                });
              }}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-black"
            >
              <option value="All">
                All Categories
              </option>

              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-black"
            >
              <option value="default">
                Sort By
              </option>
              <option value="price-low">
                Price: Low to High
              </option>
              <option value="price-high">
                Price: High to Low
              </option>
              <option value="discount">
                Highest Discount
              </option>
            </select>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredProducts.length}
            </span>{" "}
            products
          </p>

          {(search ||
            type !== "All" ||
            gender !== "All" ||
            category !== "All" ||
            sort !== "default") && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 underline underline-offset-4"
            >
              <X size={14} />
              Clear
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl bg-gray-50 px-5 py-16 text-center">
            <h2 className="text-lg font-bold text-gray-900">
              No products found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Try changing your filters or search.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {filteredProducts.map(
              (product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}

function getFinalPrice(product) {
  return (
    Number(product.price || 0) -
    (Number(product.price || 0) *
      Number(product.discount || 0)) /
      100
  );
}

export default Products;