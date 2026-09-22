const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
// Create order
const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { customer, items } = req.body;

    // Validate customer details
    if (
      !customer ||
      !customer.name ||
      !customer.phone ||
      !customer.address ||
      !customer.city ||
      !customer.state ||
      !customer.pincode
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "All customer details are required",
      });
    }

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    // Validate products
    for (const item of items) {
      if (!item.productId || !item.size) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,
          message: "Product and size are required",
        });
      }

      const quantity = Number(item.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,
          message: "Invalid product quantity",
        });
      }

      const product = await Product.findById(
        item.productId
      ).session(session);

      if (!product) {
        await session.abortTransaction();

        return res.status(404).json({
          success: false,
          message: "One of the products no longer exists",
        });
      }

      // Validate size
      if (!product.sizes.includes(item.size)) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,
          message: `${product.title} is not available in size ${item.size}`,
        });
      }

      // Check stock
      if (product.stock < quantity) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} item${
            product.stock === 1 ? "" : "s"
          } of ${product.title} available in stock.`,
        });
      }

      // Calculate actual price on server
      const finalPrice =
        Number(product.price) -
        (Number(product.price) *
          Number(product.discount || 0)) /
          100;

      const roundedPrice = Math.round(finalPrice);

      orderItems.push({
        productId: product._id,
        title: product.title,
        image: product.image,
        size: item.size,
        quantity,
        price: roundedPrice,
      });

      totalAmount += roundedPrice * quantity;
    }

    // Reduce stock atomically inside transaction
    for (const item of orderItems) {
      const updatedProduct =
        await Product.findOneAndUpdate(
          {
            _id: item.productId,
            stock: {
              $gte: item.quantity,
            },
          },
          {
            $inc: {
              stock: -item.quantity,
            },
          },
          {
            new: true,
            session,
          }
        );

      if (!updatedProduct) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,
          message: `Not enough stock available for ${item.title}. Please update your cart and try again.`,
        });
      }
    }

    // Create order inside same transaction
    const createdOrders = await Order.create(
      [
        {
          customer: {
            name: customer.name.trim(),
            phone: customer.phone.trim(),
            address: customer.address.trim(),
            city: customer.city.trim(),
            state: customer.state.trim(),
            pincode: customer.pincode.trim(),
          },

          items: orderItems,

          totalAmount,

          status: "Pending",
        },
      ],
      {
        session,
      }
    );

    const order = createdOrders[0];

    // Commit everything
    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    await session.abortTransaction();

    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  } finally {
    session.endSession();
  }
};

// Get all orders - owner
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single order - owner
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update order status - owner
// Update order status - owner
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // If order is being cancelled for the first time,
    // restore the ordered quantities back to product stock.
    if (
      status === "Cancelled" &&
      order.status !== "Cancelled" &&
      !order.stockRestored
    ) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          {
            $inc: {
              stock: item.quantity,
            },
          }
        );
      }

      order.stockRestored = true;
    }

    // Update status
    order.status = status;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

const trackOrder = async (req, res) => {
  try {
    const { orderId, phone } = req.body;

    if (!orderId || !phone) {
      return res.status(400).json({
        success: false,
        message: "Order ID and phone number are required",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      "customer.phone": phone,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found. Check your Order ID and phone number.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Track order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to track order",
    });
  }
};

// Delete order permanently - owner
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Order deleted permanently",
    });
  } catch (error) {
    console.error("Delete order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete order",
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  trackOrder,
};