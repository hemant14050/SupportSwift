const mongoose = require("mongoose");
require("dotenv").config();

exports.connectDb = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("🎉Connected to mongodb successfully!");
    })
    .catch((err) => {
        console.log(err);
        console.log("⚒️Error while connecting to mongodb!");
        process.exit(1);
    })
}