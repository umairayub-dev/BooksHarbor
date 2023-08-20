const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      user_id: String,
      customerAddress: String,
      customerContact: String,
      customerName: String,
      customerEmail: String,
    },
    products: {
      type: Array,
      required: true,
    },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Canceled"],
      default: "Pending",
    },
    tracking: {
      statusUpdates: [
        {
          timestamp: Date,
          status: String,
          location: String,
          notes: String,
          estimatedDeliveryTime: String,
        },
      ],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
