require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const UserRouter = require("./backend/Users/UserRouter");
const BookRouter = require("./backend/Books/BookRouter");
const ReviewRouter = require("./backend/Reviews/ReviewRouter");
const CategoriesRouter = require("./backend/Categories/CategoryRouter");
const PublisherRouter = require("./backend/Publishers/PublisherRouter");
const OrdersRouter = require("./backend/Orders/OrderRouter");
const StatsRouter = require("./backend/Stats/StatsRouter");

const PORT = process.env.PORT || 5000;

const path = require("path");

const clientpath = path.join(__dirname, "./frontend/dist");
app.use("/", express.static(clientpath));

// Middleware Connections
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1", UserRouter);
app.use("/api/v1", BookRouter);
app.use("/api/v1", ReviewRouter);
app.use("/api/v1", ReviewRouter);
app.use("/api/v1", CategoriesRouter);
app.use("/api/v1", PublisherRouter);
app.use("/api/v1", OrdersRouter);
app.use("/api/v1", StatsRouter);
// Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    app.listen(PORT, () => {
      console.log("DB Connected And App running in port: " + PORT);
    });
  })
  .catch((error) => {
    console.log("Error in DB connection: " + error);
  });

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/dist/index.html"));
});
