const express = require("express");
const app = express();
require("dotenv").config();
const {connectDb} = require("./config/database");

connectDb();

app.get("/", (req, res) => {
    res.send(`<h1>Welcome to SupportSwift API </h1><p>The Ticket Management System</h1></p>`);
});

app.listen(process.env.PORT, () => {
    console.log(`🚀Server is Runnig at PORT: ${process.env.PORT}`);
});