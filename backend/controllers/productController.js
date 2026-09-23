const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

// =========================
// Upload image to Cloudinary
// =========================

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
// Delete image from Cloudinary
// =========================

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(
      "Cloudinary Delete Error:",
      error
    );
  }
};


// =========================
// Get public ID from old URL
// =========================

const getPublicIdFromUrl = (imageUrl) => {
  if (!imageUrl) {
    return "";
  }

  try {
    const url = new URL(imageUrl);

    const uploadIndex =
      url.pathname.indexOf("/upload/");

    if (uploadIndex === -1) {
      return "";
    }

    let publicPath =
      url.pathname.substring(
        uploadIndex + "/upload/".length
      );

    // Remove Cloudinary transformations
    // such as /f_auto,q_auto/
    const parts = publicPath.split("/");

    const versionIndex = parts.findIndex(
      (part) => /^v\d+$/.test(part)
    );

    if (versionIndex !== -1) {
      publicPath = parts
        .slice(versionIndex + 1)
        .join("/");
    }

    // Remove file extension
    publicPath = publicPath.replace(
      /\.[^/.]+$/,
      ""
    );

    return publicPath;
  } catch (error) {
    console.error(
      "Get Cloudinary Public ID Error:",
      error
    );

    return "";
  }
};


// =========================
// Helper: Parse Sizes
// =========================

const parseSizes = (sizes, type) => {
  if (type === "General") {
    return ["Free Size"];
  }

  if (Array.isArray(sizes)) {
    return sizes;
  }

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

    const productType = type || "Clothing";

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

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product title is required",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Product description is required",
      });
    }

    if (!category?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product category is required",
      });
    }

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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    // Upload image
    const result = await uploadToCloudinary(
      req.file.buffer
    );

    const parsedSizes = parseSizes(
      sizes,
      productType
    );

    const product = await Product.create({
      type: productType,

      title: title.trim(),

      description: description.trim(),

      category: category.trim(),

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

      // Store Cloudinary public ID
      imagePublicId: result.public_id,
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

    const productType =
      type || product.type || "Clothing";

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

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product title is required",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Product description is required",
      });
    }

    if (!category?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product category is required",
      });
    }

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

    product.type = productType;

    product.title = title.trim();

    product.description =
      description.trim();

    product.category = category.trim();

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

    product.sizes = parseSizes(
      sizes,
      productType
    );


    // =========================
    // Replace Product Image
    // =========================

    if (req.file) {
      // Save old image information first
      const oldPublicId =
        product.imagePublicId ||
        getPublicIdFromUrl(product.image);

      // Upload new image
      const result =
        await uploadToCloudinary(
          req.file.buffer
        );

      // Update database with new image
      product.image =
        result.secure_url;

      product.imagePublicId =
        result.public_id;

      await product.save();

      // Delete old image after
      // new image is successfully saved
      if (
        oldPublicId &&
        oldPublicId !== result.public_id
      ) {
        await deleteFromCloudinary(
          oldPublicId
        );
      }
    } else {
      await product.save();
    }


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
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Get Cloudinary public ID
    // Works for both new and old products
    const publicId =
      product.imagePublicId ||
      getPublicIdFromUrl(product.image);

    // Delete image from Cloudinary
    if (publicId) {
      await deleteFromCloudinary(
        publicId
      );
    }

    // Delete product from MongoDB
    await Product.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Product and product image deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Product Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete product",
      error: error.message,
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