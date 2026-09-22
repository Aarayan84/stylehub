
import { useEffect, useRef, useState } from "react";

const availableSizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
];

const productTypes = [
  "Clothing",
  "General",
];

const genders = [
  "Men",
  "Women",
  "Kids",
];

const clothingCategories = [
  "T-Shirts",
  "Shirts",
  "Jeans",
  "Trousers",
  "Jackets",
  "Hoodies",
  "Dresses",
  "Shoes",
  "Accessories",
];

const generalCategories = [
  "Water Bottles",
  "Hot Case",
  "Lunch Box",
  "Plastic Containers",
  "Storage Boxes",
  "Kitchen Items",
  "Household Items",
  "Cleaning Items",
  "Bathroom Accessories",
  "Buckets",
  "Mugs",
  "Baskets",
  "Hangers",
  "Dustbins",
  "Personal Care",
  "Kids & Toys",
  "Stationery",
  "Home & Utility",
  "Home Decor",
];

function ProductForm({
  initialData = null,
  onSubmit,
  loading = false,
  submitText = "Save Product",
}) {
  const [formData, setFormData] = useState({
    type: initialData?.type || "Clothing",
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    gender: initialData?.gender || "",
    price: initialData?.price || "",
    discount: initialData?.discount || 0,
    sizes:
      initialData?.sizes?.length > 0
        ? initialData.sizes
        : [],
    stock: initialData?.stock || "",
    image: initialData?.image || "",
  });

  // Actual image File selected from device/camera
  const [imageFile, setImageFile] = useState(null);

  // Image preview
  const [imagePreview, setImagePreview] = useState(
    initialData?.image || ""
  );

  // Camera states
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Update form when editing an existing product
  useEffect(() => {
    if (!initialData) return;

    const type = initialData.type || "Clothing";

    setFormData({
      type,
      title: initialData.title || "",
      description: initialData.description || "",
      category: initialData.category || "",
      gender:
        type === "General"
          ? ""
          : initialData.gender || "",
      price: initialData.price || "",
      discount: initialData.discount || 0,
      sizes:
        type === "General"
          ? ["Free Size"]
          : initialData.sizes || [],
      stock: initialData.stock || "",
      image: initialData.image || "",
    });

    setImageFile(null);
    setImagePreview(initialData.image || "");
  }, [initialData]);

  // Stop camera when component is removed
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // -----------------------------
  // Normal field change
  // -----------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // -----------------------------
  // Product type change
  // -----------------------------
  const handleTypeChange = (event) => {
    const type = event.target.value;

    setFormData((previous) => ({
      ...previous,
      type,
      gender:
        type === "General"
          ? ""
          : previous.gender,
      category: "",
      sizes:
        type === "General"
          ? ["Free Size"]
          : [],
    }));
  };

  // -----------------------------
  // Size selection
  // -----------------------------
  const handleSizeChange = (size) => {
    setFormData((previous) => {
      const alreadySelected =
        previous.sizes.includes(size);

      return {
        ...previous,
        sizes: alreadySelected
          ? previous.sizes.filter(
              (item) => item !== size
            )
          : [...previous.sizes, size],
      };
    });
  };

  // -----------------------------
  // Select image from device
  // -----------------------------
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Maximum 5 MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    // Check image type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      event.target.value = "";
      return;
    }

    // Store actual File
    setImageFile(file);

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Clear old Cloudinary URL
    setFormData((previous) => ({
      ...previous,
      image: "",
    }));
  };

  // -----------------------------
  // Start camera
  // -----------------------------
  const startCamera = async () => {
    try {
      setCameraError("");

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        setCameraError(
          "Camera is not supported by this browser."
        );
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: "environment",
            },
          },
          audio: false,
        });

      streamRef.current = stream;

      setCameraOpen(true);

      // Wait for video element to render
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (error) {
      console.error("Camera Error:", error);

      setCameraError(
        "Unable to access camera. Please allow camera permission."
      );
    }
  };

  // -----------------------------
  // Stop camera
  // -----------------------------
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      streamRef.current = null;
    }

    setCameraOpen(false);
  };

  // -----------------------------
  // Capture photo
  // -----------------------------
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    if (
      !video.videoWidth ||
      !video.videoHeight
    ) {
      setCameraError(
        "Camera is not ready yet. Please try again."
      );
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError(
            "Unable to capture image."
          );
          return;
        }

        // Convert captured image to File
        const file = new File(
          [blob],
          `product-${Date.now()}.jpg`,
          {
            type: "image/jpeg",
          }
        );

        // Store actual File
        setImageFile(file);

        // Preview captured image
        const previewUrl =
          URL.createObjectURL(file);

        setImagePreview(previewUrl);

        // Remove old Cloudinary URL
        setFormData((previous) => ({
          ...previous,
          image: "",
        }));

        stopCamera();
      },
      "image/jpeg",
      0.9
    );
  };

  // -----------------------------
  // Remove image
  // -----------------------------
  const removeImage = () => {
    setImageFile(null);

    // When editing, restore existing image
    setImagePreview(
      initialData?.image || ""
    );

    setFormData((previous) => ({
      ...previous,
      image: initialData?.image || "",
    }));
  };

  // -----------------------------
  // Submit
  // -----------------------------
  const handleSubmit = (event) => {
    event.preventDefault();

    // Title
    if (!formData.title.trim()) {
      alert("Please enter product title.");
      return;
    }

    // Description
    if (!formData.description.trim()) {
      alert("Please enter product description.");
      return;
    }

    // Category
    if (!formData.category) {
      alert("Please select a category.");
      return;
    }

    // Gender only for clothing
    if (
      formData.type === "Clothing" &&
      !formData.gender
    ) {
      alert("Please select gender.");
      return;
    }

    // Price
    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      alert("Please enter a valid price.");
      return;
    }

    // Sizes only for clothing
    if (
      formData.type === "Clothing" &&
      formData.sizes.length === 0
    ) {
      alert("Please select at least one size.");
      return;
    }

    // Stock
    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      alert("Please enter valid stock.");
      return;
    }

    /*
      Image validation

      New product:
      imageFile must exist.

      Edit product:
      existing Cloudinary image is allowed.
    */
    if (
      !imageFile &&
      !formData.image
    ) {
      alert(
        "Please select or take a product image."
      );
      return;
    }

    /*
      IMPORTANT

      Keep the original image handling:

      image = imageFile || formData.image

      This means:
      - New selected image -> File
      - New camera image -> File
      - Existing edit image -> Cloudinary URL
    */
    const productData = {
      ...formData,

      type: formData.type || "Clothing",

      gender:
        formData.type === "General"
          ? ""
          : formData.gender,

      sizes:
        formData.type === "General"
          ? ["Free Size"]
          : formData.sizes,

      price: Number(formData.price),

      discount: Number(
        formData.discount || 0
      ),

      stock: Number(formData.stock),

      // IMPORTANT:
      // This is the actual File for a new image.
      image: imageFile || formData.image,
    };

    onSubmit(productData);
  };

  const categories =
    formData.type === "General"
      ? generalCategories
      : clothingCategories;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Product Type */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Product Type
        </label>

        <select
          value={formData.type}
          onChange={handleTypeChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
        >
          {productTypes.map((type) => (
            <option key={type} value={type}>
              {type === "General"
                ? "General Store"
                : type}
            </option>
          ))}
        </select>
      </div>

      {/* Product Title */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Product Title
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter product title"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Enter product description"
          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
        />
      </div>

      {/* Category + Gender */}
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
          >
            <option value="">
              Select category
            </option>

            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Gender */}
        {formData.type === "Clothing" && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Gender
            </label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
            >
              <option value="">
                Select gender
              </option>

              {genders.map((gender) => (
                <option
                  key={gender}
                  value={gender}
                >
                  {gender}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Price / Discount / Stock */}
      <div className="grid gap-5 sm:grid-cols-3">
        {/* Price */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Price
          </label>

          <input
            type="number"
            name="price"
            min="0"
            value={formData.price}
            onChange={handleChange}
            placeholder="0"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
          />
        </div>

        {/* Discount */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Discount (%)
          </label>

          <input
            type="number"
            name="discount"
            min="0"
            max="100"
            value={formData.discount}
            onChange={handleChange}
            placeholder="0"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Stock
          </label>

          <input
            type="number"
            name="stock"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            placeholder="0"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
          />
        </div>
      </div>

      {/* Clothing Sizes */}
      {formData.type === "Clothing" && (
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Available Sizes
          </label>

          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => {
              const selected =
                formData.sizes.includes(size);

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() =>
                    handleSizeChange(size)
                  }
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    selected
                      ? "border-black bg-black text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* General Store Size */}
      {formData.type === "General" && (
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-700">
            Size
          </p>

          <p className="mt-1 text-sm text-gray-500">
            General Store products automatically use
            Free Size.
          </p>
        </div>
      )}

      {/* Product Image */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Product Image
        </label>

        <div className="rounded-xl border-2 border-dashed border-gray-300 p-4">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Product preview"
                className="mx-auto h-64 w-full rounded-lg bg-gray-50 object-contain"
              />

              <button
                type="button"
                onClick={removeImage}
                className="mt-3 w-full rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Remove Image
              </button>
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-sm text-gray-500">
                Select an image or take a photo
              </p>
            </div>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {/* Select from device */}
            <label className="cursor-pointer rounded-lg bg-black px-4 py-3 text-center text-sm font-semibold text-white hover:bg-gray-800">
              Select Image

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* Take photo */}
            <button
              type="button"
              onClick={startCamera}
              className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Take Photo
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-gray-500">
            JPG, JPEG, PNG or WEBP · Maximum 5 MB
          </p>
        </div>
      </div>

      {/* Camera */}
      {cameraOpen && (
        <div className="rounded-xl border border-gray-200 bg-black p-4">
          <div className="overflow-hidden rounded-lg">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-auto max-h-[500px] w-full object-contain"
            />
          </div>

          {cameraError && (
            <p className="mt-3 text-sm text-red-400">
              {cameraError}
            </p>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={capturePhoto}
              className="rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black"
            >
              Capture Photo
            </button>

            <button
              type="button"
              onClick={stopCamera}
              className="rounded-lg border border-white/30 px-4 py-3 text-sm font-semibold text-white"
            >
              Cancel Camera
            </button>
          </div>

          <canvas
            ref={canvasRef}
            className="hidden"
          />
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Saving..."
          : submitText}
      </button>
    </form>
  );
}

export default ProductForm;
