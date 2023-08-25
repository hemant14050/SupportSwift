const express = require("express");
const app = express();
require("dotenv").config();
const {connectDb} = require("./config/database");
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/auth.routes");
const departmentRoutes = require("./routes/department.routes");
const ticketRoutes = require("./routes/ticket.routes");

app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/department", departmentRoutes);
app.use("/api/v1/ticket", ticketRoutes);

connectDb();

app.get("/", (req, res) => {
    res.send(`<h1>Welcome to SupportSwift API </h1><p>The Ticket Management System</h1></p>`);
});

app.listen(process.env.PORT, () => {
    console.log(`🚀Server is Running at PORT: ${process.env.PORT}`);
});