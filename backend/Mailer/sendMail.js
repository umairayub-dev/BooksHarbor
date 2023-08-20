require("dotenv").config();
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_MAIL, // Your Gmail email address
    pass: process.env.GMAIL_PASSWORD, // Your Gmail password or app-specific password
  },
});

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "BookHarbor",
    link: process.env.APP_LINK,
  },
});

const sendSignupEmail = (email, username) => {
  const response = {
    body: {
      name: username,
      intro: "Welcome to BookHarbor! We're excited to have you on board.",
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  const emailBody = mailGenerator.generate(response);
  const mailOptions = {
    from: process.env.GMAIL_MAIL, // Sender Gmail address
    to: email, // Recipient email address
    subject: "Welcome to BookHarbor", // Email subject
    html: emailBody,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

const sendOrderNotificationEmail = (email, orderDetails, isAdmin = false) => {
  let response;

  const productRows = orderDetails.products.map((product, index) => ({
    item: `Product ${index + 1}`,
    description: `${product.title} - Quantity: ${product.quantity}, Price: $${product.price}`,
  }));

  if (isAdmin) {
    response = {
      body: {
        name: "Admin",
        intro: "A new order has been received.",
        table: [
          {
            title: "Order Details",
            data: [
              {
                item: "Order ID",
                description: orderDetails._id,
              },
              {
                item: "Total Amount",
                description: `$${orderDetails.totalAmount}`,
              },
              {
                item: "Customer Name",
                description: orderDetails.user.customerName,
              },
              {
                item: "Contact Email",
                description: orderDetails.user.customerEmail,
              },
              {
                item: "Contact Phone",
                description: orderDetails.user.customerContact,
              },
              {
                item: "Shipping Address",
                description: orderDetails.user.customerAddress,
              },
            ],
          },
          {
            title: "Product Details",
            data: productRows,
            columns: {
              customWidth: {
                item: "20%",
                price: "15%",
              },
            },
          },
        ],
        outro: "Please process the order accordingly.",
      },
    };
  } else {
    response = {
      body: {
        name: orderDetails.user.customerName,
        intro: "Your order has been successfully placed!",
        table: [
          {
            title: "Order Details",
            data: [
              {
                item: "Order ID",
                description: orderDetails._id,
              },
              {
                item: "Total Amount",
                description: `$${orderDetails.totalAmount}`,
              },
              {
                item: "Contact Email",
                description: orderDetails.user.customerEmail,
              },
              {
                item: "Contact Phone",
                description: orderDetails.user.customerContact,
              },
              {
                item: "Shipping Address",
                description: orderDetails.user.customerAddress,
              },
            ],
          },
          {
            title: "Product Details",
            data: productRows,
            columns: {
              customWidth: {
                item: "20%",
                price: "15%",
              },
            },
          },
        ],
        outro: `Thank you for shopping with us. You can track the status of your order <a href='${process.env.APP_LINK}/track_order?orderId=/${orderDetails._id}'>Here</a>. If you have any questions, feel free to contact us.`,
      },
    };
  }

  const emailBody = mailGenerator.generate(response);
  const mailOptions = {
    from: process.env.GMAIL_MAIL, // Sender Gmail address
    to: email, // Recipient email address
    subject: isAdmin ? "New Order Received" : "Order Confirmation", // Email subject
    html: emailBody,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

const sendOrderStatusUpdateEmail = (email, orderDetails, newStatus) => {
  let statusMessage = "";

  switch (newStatus) {
    case "Shipped":
      statusMessage = "Your order has been shipped and is on its way to you.";
      break;
    case "Delivered":
      statusMessage =
        "Your order has been delivered successfully. Enjoy your products!";
      break;
    case "Canceled":
      statusMessage =
        "Unfortunately, your order has been canceled. If you have any questions, please contact us.";
      break;
    default:
      statusMessage = `The status of your order (Order ID: ${orderDetails._id}) has been updated to ${newStatus}.`;
  }

  const response = {
    body: {
      name: orderDetails.user.customerName,
      intro: statusMessage,
      table: [
        {
          title: "Order Details",
          data: [
            {
              item: "Order ID",
              description: orderDetails._id,
            },
            {
              item: "New Status",
              description: newStatus,
            },
          ],
        },
      ],
      outro: `Thank you for shopping with us. You can track the status of your order <a href='${process.env.APP_LINK}/track_order?orderId=/${orderDetails._id}'>Here</a>. If you have any questions, feel free to contact us.`,
    },
  };

  const emailBody = mailGenerator.generate(response);
  const mailOptions = {
    from: process.env.GMAIL_MAIL, // Sender Gmail address
    to: email, // Recipient email address
    subject: "Order Status Update", // Email subject
    html: emailBody,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

module.exports = {
  sendSignupEmail,
  sendOrderNotificationEmail,
  sendOrderStatusUpdateEmail,
};
