const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("waiting".cyan.underline);
        const conn = await mongoose.connect(process.env.MONGO_URI, {});
        console.log("mongodb connected".cyan.underline, conn.connection.host);
    } catch (e) {
        console.log(`error is :${e.message}`);
        process.exit();
    }
};

module.exports = connectDB;
