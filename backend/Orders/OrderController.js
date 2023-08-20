const Order = require("./OrderModel");
const {
  sendOrderNotificationEmail,
  sendOrderStatusUpdateEmail,
} = require("../Mailer/sendMail");
const { default: mongoose } = require("mongoose");

const orders = async (req, res) => {
  const { limit, page } = req.query;

  const limitValue = parseInt(limit) || 20;
  const pageValue = parseInt(page) || 1;
  try {
    const total = await Order.countDocuments();
    const orders = await Order.find()
      .skip((pageValue - 1) * limitValue)
      .limit(limitValue);
    res.status(200).json({ orders, total });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

const getOrdersByUserId = async (req, res) => {
  const user_id = req.user._id;
  try {
    const orders = await Order.find({ "user.user_id": user_id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrder = async (req, res) => {
  const { user, products, totalAmount, trackingInfo } = req.body;

  try {
    if (!user || !products || !totalAmount) {
      return res
        .status(400)
        .json({ message: "Invalid data. Missing required fields." });
    }

    // Create a new order object with the provided data
    const newOrder = await Order.create({
      user,
      products,
      totalAmount,
      tracking: {
        statusUpdates: [
          {
            timestamp: new Date(),
            status: "Pending",
            location: "-",
            notes: "Order has been placed",
            estimatedDeliveryTime: "2-4 Working Days",
          },
        ],
      },
    });

    // Send order confirmation email to the user
    sendOrderNotificationEmail(user.customerEmail, newOrder);

    // Send order received email to the admin
    sendOrderNotificationEmail(process.env.ADMIN_EMAIL, newOrder, true);

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// const createOrder = async (req, res) => {
//   const { user, products, totalAmount } = req.body;

//   try {
//     if (!user || !products || !totalAmount) {
//       return res
//         .status(400)
//         .json({ message: "Invalid data. Missing required fields." });
//     }

//     const newOrder = await Order.create({ user, products, totalAmount });
//     // Send order confirmation email to the user
//     sendOrderNotificationEmail(user.customerEmail, newOrder);

//     // Send order received email to the admin
//     sendOrderNotificationEmail(process.env.ADMIN_EMAIL, newOrder, true);
//     res.status(201).json(newOrder);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// const updateOrderStatus = async (req, res) => {
//   const { limit, page } = req.query;
//   const { orderId } = req.params;
//   const { status } = req.body;

//   const limitValue = parseInt(limit) || 20;
//   const pageValue = parseInt(page) || 1;
//   try {
//     if (!status) {
//       return res.status(400).json({ message: "Missing status in request" });
//     }

//     const updatedOrder = await Order.findByIdAndUpdate(
//       orderId,
//       { status },
//       { new: true }
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     sendOrderStatusUpdateEmail(
//       updatedOrder.user.customerEmail,
//       updatedOrder,
//       status
//     );
//     const total = await Order.countDocuments();
//     const orders = await Order.find()
//       .skip((pageValue - 1) * limitValue)
//       .limit(limitValue);
//     return res.status(200).json({ orders, total });
//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// };

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { limit, page } = req.query;
  const limitValue = parseInt(limit) || 20;
  const pageValue = parseInt(page) || 1;
  const { status, location, notes, estimatedDeliveryTime } = req.body;

  console.log(status, location, notes, estimatedDeliveryTime);
  try {
    if (!status) {
      return res.status(400).json({ message: "Missing status in request" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        status,
        $push: {
          "tracking.statusUpdates": {
            timestamp: new Date(),
            status,
            location,
            notes,
            estimatedDeliveryTime,
          },
        },
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Send status update email
    sendOrderStatusUpdateEmail(
      updatedOrder.user.customerEmail,
      updatedOrder,
      status
    );

    const total = await Order.countDocuments();
    const orders = await Order.find()
      .skip((pageValue - 1) * limitValue)
      .limit(limitValue);
    return res.status(200).json({ orders, total });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// const cancelOrder = async (req, res) => {
//   const { orderId } = req.params;

//   try {
//     const order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // Check if the user is authorized to cancel the order (assuming user_id is present in req.user)
//     if (order.user.user_id.toString() !== req.user._id.toString()) {
//       return res
//         .status(403)
//         .json({ message: "Unauthorized - cannot delete review" });
//     }
//     order.status = "Canceled";
//     await order.save();

//     sendOrderStatusUpdateEmail(order.user.customerEmail, order, order.status);

//     res.status(200).json(order);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

const cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the user is authorized to cancel the order (assuming user_id is present in req.user)
    if (order.user.user_id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized - cannot cancel order" });
    }

    // Update order status and add cancellation tracking update
    order.status = "Canceled";
    order.tracking.statusUpdates.push({
      timestamp: new Date(),
      status: "Canceled",
      location: "-",
      notes: "Order has been canceled",
    });

    await order.save();

    // Send status update email
    sendOrderStatusUpdateEmail(order.user.customerEmail, order, order.status);

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const trackOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order id format" });
    }

    const order = await Order.findById(orderId).select("-user");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getOrdersByUserId,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  orders,
  trackOrder,
};
