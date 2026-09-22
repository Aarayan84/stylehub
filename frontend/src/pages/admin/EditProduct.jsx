
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ProductForm from "../../components/ProductForm";
import {
  getProductById,
  updateProduct,
} from "../../services/productService";
import { useAuth } from "../../context/AuthContext";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(id);

        setProduct(data.product);
      } catch (error) {
        console.error("Get Product Error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Update product
  const handleSubmit = async (productData) => {
    try {
      setSaving(true);
      setError("");

      // Create FormData for image upload
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

      // Gender is only required for clothing
      if (productData.type === "Clothing") {
        formData.append(
          "gender",
          productData.gender || ""
        );
      }

      formData.append(
        "price",
        productData.price || 0
      );

      formData.append(
        "discount",
        productData.discount || 0
      );

      // General products always use Free Size
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
        productData.stock || 0
      );

      // IMPORTANT:
      // ProductForm returns the new selected/captured
      // image File inside productData.image.
      //
      // If no new image was selected, this will not
      // append anything and the backend keeps the
      // existing Cloudinary image.
      if (productData.image instanceof File) {
        formData.append(
          "image",
          productData.image
        );
      }

      await updateProduct(id, formData, token);

      navigate("/admin/products");
    } catch (error) {
      console.error("Update Product Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
            <p className="text-sm text-gray-500">
              Loading product...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Product could not be loaded
  if (error && !product) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl bg-red-50 p-5 text-sm text-red-600">
            {error}
          </div>

          <button
            onClick={() =>
              navigate("/admin/products")
            }
            className="mt-4 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Edit Product
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update the product information, price,
            discount, stock, or sizes.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Product Form */}
        <div className="mt-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-8">
          <ProductForm
            initialData={product}
            onSubmit={handleSubmit}
            loading={saving}
            submitText="Update Product"
          />
        </div>
      </div>
    </div>
  );
}

export default EditProduct;