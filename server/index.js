const express = require("express");
const app = express();
require("dotenv").config();
const {connectDb} = require("./config/database");
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/auth.routes");
const departmentRoutes = require("./routes/department.routes");
const ticketRoutes = require("./routes/ticket.routes");
const chatRoutes  = require("./routes/chat.routes");
const { isLoggedIn } = require("./middlewares/auth");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use("/auth", authRoutes);
app.use("/department", departmentRoutes);
app.use("/ticket", ticketRoutes);
app.use("/ticket", chatRoutes);

connectDb();

app.get("/", (req, res) => {
    res.sendFile("index.html");
});

app.get("/auth/login", (req, res) => {
    res.render("login.ejs" , {error: null});
});

app.get("/dashboard", isLoggedIn, (req, res) => {
    if(req.user) {
        return res.render("dashboard.ejs", {user: req.user});
    } else {
        return res.redirect("/auth/login");
    }
});

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    return res.redirect("/auth/login");
});

app.get("/department", isLoggedIn, (req, res) => {
    if(req.user) {
        return res.render("department.ejs", {user: req.user});
    } else {
        return res.redirect("/auth/login");
    }
});

app.get("/profile", isLoggedIn, (req, res) => {
    if(req.user) {
        return res.render("profile.ejs", {user: req.user});
    } else {
        return res.redirect("/auth/login");
    }
});

app.get("/tickets", isLoggedIn, (req, res) => {
    if(req.user) {
        return res.render("tickets.ejs", {user: req.user});
    } else {
        return res.redirect("/auth/login");
    }
});


app.listen(process.env.PORT, () => {
    console.log(`🚀Server is Running at PORT: ${process.env.PORT}`);
});