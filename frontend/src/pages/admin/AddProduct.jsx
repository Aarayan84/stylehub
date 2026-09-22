
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductForm from "../../components/ProductForm";
import { createProduct } from "../../services/productService";
import { useAuth } from "../../context/AuthContext";

function AddProduct() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (productData) => {
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append(
        "type",
        productData.type || "Clothing"
      );

      formData.append(
        "title",
        productData.title || ""
      );

      formData.append(
        "description",
        productData.description || ""
      );

      formData.append(
        "category",
        productData.category || ""
      );

      if (productData.type === "Clothing") {
        formData.append(
          "gender",
          productData.gender || ""
        );
      }

      formData.append(
        "price",
        String(productData.price || 0)
      );

      formData.append(
        "discount",
        String(productData.discount || 0)
      );

      formData.append(
        "sizes",
        JSON.stringify(
          productData.type === "General"
            ? ["Free Size"]
            : productData.sizes || []
        )
      );

      formData.append(
        "stock",
        String(productData.stock || 0)
      );

      // IMPORTANT:
      // ProductForm puts the selected/taken File
      // inside productData.image.
      if (productData.image instanceof File) {
        formData.append(
          "image",
          productData.image
        );
      }

      await createProduct(formData, token);

      navigate("/admin/products");
    } catch (error) {
      console.error(
        "Add Product Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to create product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Add Product
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Add a new product to Sushil Style Hub.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-8">
          <ProductForm
            onSubmit={handleSubmit}
            loading={loading}
            submitText="Add Product"
          />
        </div>
      </div>
    </div>
  );
}

export default AddProduct;