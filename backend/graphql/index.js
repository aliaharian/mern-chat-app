const { ApolloServer } = require("apollo-server-express");
const fs = require("fs");
const path = require("path");
const { allUsers } = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");
const { fetchChats } = require("../controllers/chatControllers");
const { fetchMessages } = require("../controllers/messageControllers");
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const gqlFiles = fs.readdirSync(path.join(__dirname, "./typedefs"));
let typeDefs = "";
gqlFiles.forEach((file) => {
    typeDefs += fs.readFileSync(path.join(__dirname, "./typedefs", file), {
        encoding: "utf-8",
    });
});

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        users: async (p, args, cx) => {
            const { req, res, next } = cx;
            req.query = { ...args };
            try {
                await protect(req, res, next);
                return allUsers(req, res);
            } catch (e) {
                console.log(e);
                return null;
            }
        },
        chats: async (p, args, cx) => {
            const { req, res, next } = cx;
            try {
                await protect(req, res, next);
                return fetchChats(req, res);
            } catch (e) {
                console.log(e);
                return null;
            }
        },
        messages: async (p, args, cx) => {
            const { req, res, next } = cx;
            req.query = { ...args };
            try {
                await protect(req, res, next);
                return fetchMessages(req, res);
            } catch (e) {
                console.log(e);
                return null;
            }
        },
    },
};

const apServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => {
        req.gql = true;
        return {
            req,
            res,
            next: () => {},
        };
    },
});
const initGraphql = (app) => {
    apServer.start().then(() => {
        apServer.applyMiddleware({ app });
        console.log("graphql started!".blue.underline.bold);
    });
};

module.exports = { initGraphql, apServer };
