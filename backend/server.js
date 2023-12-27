const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const protect = require("./middlewares/authMiddleware");
require("colors");

dotenv.config();
connectDB();
const app = express();
app.use(express.json());

app.get("/", function (req, res) {
    res.send("API is running successfully");
});
app.use("/api/user", userRoutes);
app.use(protect).use("/api/chat", chatRoutes);
app.use(protect).use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, console.log(`live on ${port}`.yellow.bold));
