const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

// Upload image buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "sushil-style-hub/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(buffer);
  });
};

// =========================
// Helper: Parse Sizes
// =========================

const parseSizes = (sizes, type) => {
  /*
   * General products do not need clothing sizes.
   * We automatically store them as Free Size.
   */
  if (type === "General") {
    return ["Free Size"];
  }

  /*
   * If sizes is already an array
   */
  if (Array.isArray(sizes)) {
    return sizes;
  }

  /*
   * If sizes comes through FormData as a
   * JSON string.
   */
  if (typeof sizes === "string") {
    try {
      const parsed = JSON.parse(sizes);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (error) {
      throw new Error("Invalid sizes format");
    }
  }

  /*
   * No sizes provided for clothing
   */
  return [];
};

// =========================
// Create Product
// =========================

const createProduct = async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      category,
      gender,
      price,
      discount,
      sizes,
      stock,
    } = req.body;

    /*
     * Product type
     */
    const productType = type || "Clothing";

    /*
     * Validate product type
     */
    if (
      !["Clothing", "General"].includes(
        productType
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product type must be Clothing or General",
      });
    }

    /*
     * Validate title
     */
    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product title is required",
      });
    }

    /*
     * Validate description
     */
    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Product description is required",
      });
    }

    /*
     * Validate category
     */
    if (!category?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product category is required",
      });
    }

    /*
     * Gender is required only for Clothing
     */
    if (
      productType === "Clothing" &&
      !gender
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Gender is required for clothing products",
      });
    }

    /*
     * Check image
     */
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    /*
     * Upload image to Cloudinary
     */
    const result = await uploadToCloudinary(
      req.file.buffer
    );

    /*
     * Parse sizes
     */
    const parsedSizes = parseSizes(
      sizes,
      productType
    );

    /*
     * Create product
     */
    const product = await Product.create({
      type: productType,

      title: title.trim(),

      description: description.trim(),

      category: category.trim(),

      /*
       * General products don't have a gender.
       */
      gender:
        productType === "General"
          ? undefined
          : gender,

      price: Number(price),

      discount:
        discount === undefined ||
        discount === ""
          ? 0
          : Number(discount),

      sizes: parsedSizes,

      stock:
        stock === undefined ||
        stock === ""
          ? 0
          : Number(stock),

      image: result.secure_url,
    });

    res.status(201).json({
      success: true,
      message:
        "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(
      "Create Product Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// =========================
// Get All Products
// =========================

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(
      "Get Products Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get Single Product
// =========================

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(
      "Get Product Error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

// =========================
// Update Product
// =========================

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      type,
      title,
      description,
      category,
      gender,
      price,
      discount,
      sizes,
      stock,
    } = req.body;

    /*
     * Product type
     *
     * Keep existing type if the request doesn't
     * contain one.
     */
    const productType =
      type || product.type || "Clothing";

    /*
     * Validate type
     */
    if (
      !["Clothing", "General"].includes(
        productType
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product type must be Clothing or General",
      });
    }

    /*
     * Validate title
     */
    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product title is required",
      });
    }

    /*
     * Validate description
     */
    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Product description is required",
      });
    }

    /*
     * Validate category
     */
    if (!category?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product category is required",
      });
    }

    /*
     * Gender required only for Clothing
     */
    if (
      productType === "Clothing" &&
      !gender
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Gender is required for clothing products",
      });
    }

    /*
     * Update normal fields
     */
    product.type = productType;

    product.title = title.trim();

    product.description =
      description.trim();

    product.category = category.trim();

    /*
     * General products don't have gender
     */
    product.gender =
      productType === "General"
        ? undefined
        : gender;

    product.price = Number(price);

    product.discount =
      discount === undefined ||
      discount === ""
        ? 0
        : Number(discount);

    product.stock =
      stock === undefined ||
      stock === ""
        ? 0
        : Number(stock);

    /*
     * Update sizes
     */
    product.sizes = parseSizes(
      sizes,
      productType
    );

    /*
     * If a new image was selected,
     * upload it to Cloudinary.
     */
    if (req.file) {
      const result =
        await uploadToCloudinary(
          req.file.buffer
        );

      product.image =
        result.secure_url;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message:
        "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(
      "Update Product Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Delete Product
// =========================

const deleteProduct = async (req, res) => {
  try {
    const product =
      await Product.findByIdAndDelete(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Product deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Product Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};