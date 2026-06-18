const Order = require("../models/Order");

// Create Order
const createOrder = async (req, res) => {
  try {
    console.log("req.user:", req.user);
    console.log("req.body:", req.body);

    const { products, shippingAddress, totalAmount } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        message: "No order items",
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        message: "Invalid order amount",
      });
    }

    const order = await Order.create({
      user: req.user._id,
      products,
      shippingAddress,
      totalAmount,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get Logged In User Orders
const getUserOrders = async (req, res) => {
  try {
    console.log("req.user:", req.user);

    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    console.log("orders found:", orders);

    res.status(200).json(orders);
  } catch (error) {
    console.error("Get Orders Error:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
};