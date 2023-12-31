const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { errorHandler } = require("./middlewares/errorMiddleware");
const path = require("path");
const { typeDefs, resolvers } = require("./graphql/index");
const http = require("http");
const { ApolloServer } = require("@apollo/server");
const {
    ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { expressMiddleware } = require("@apollo/server/express4");

require("colors");

// app.use(graphql);

dotenv.config();
connectDB();
const app = express();
const httpServer = http.createServer(app);
// initGraphql(app, httpServer);
app.use(express.json());
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
apolloServer.start().then(() => {
    app.use(
        "/graphql",
        expressMiddleware(apolloServer, {
            context: ({ req, res }) => {
                req.gql = true;
                return {
                    req,
                    res,
                    next: () => {},
                };
            },
        }),
    );
});

const __dirname1 = path.resolve();

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/frontend/dist")));

    app.get("*", (req, res) =>
        res.sendFile(
            path.resolve(__dirname1, "frontend", "dist", "index.html"),
        ),
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}

// app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
    console.log(`live on ${port}`.yellow.bold);
    // console.log(`graphql path is ${apServer.graphqlPath}`);
    // console.log(
    //     `🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`,
    // );
});

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: [
            "http://127.0.0.1:5173",
            "http://localhost:5173",
            "https://chat.tourino.ir",
        ],
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
