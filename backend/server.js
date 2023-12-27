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

const server = app.listen(port, console.log(`live on ${port}`.yellow.bold));

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://127.0.0.1:5173",
    },
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit("connected");
    });
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user joined room", room);
    });
    socket.on("new message", (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;
        if (!chat.users) {
            console.log("chat dont have user!");
        }
        chat.users.forEach((user) => {
            if (user._id === newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message received", newMessageRecieved);
        });
        console.log("new message recieved");
    });
    socket.on("typing", (room) => {
        socket.in(room).emit("typing");
    });
    socket.on("stop typing", (room) => {
        socket.in(room).emit("stop typing");
    });

    socket.off("setup", (userData) => {
        socket.leave(userData._id);
        console.log(userData._id, "left chat");
    });
});
