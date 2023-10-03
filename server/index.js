const express = require("express");
const app = express();
require("dotenv").config();
const {createServer} = require("http");
const server = createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// =======================================SOCKET.IO STARTS=======================================
const {
    getAllOnlineUsers, 
    setOnlineUser, 
    getOnlineUser, 
    deleteOnlineUser
} = require("./data/onlineUsers");

io.on("connection", (socket) => {
    console.log("New Socket Connection");

    socket.on("joinRoom", ({ticketId, userId, userData}) => {
        // console.log("joinRoom", ticketId, userId, userData);
        socket.join(ticketId);
        setOnlineUser({ticketId, userId, socketId: socket.id, userData});
        // console.log(getAllOnlineUsers());
    });

    socket.on("sendMessage", ({ticketId, userId, text}) => {

        // console.log("sendMessage", ticketId, userId, text);
        const onlineUser = getOnlineUser({ticketId, userId});
        if(onlineUser) {
            io.to(ticketId).emit("message", {message: {text, sender: onlineUser.userData, createdAt: Date.now()}, userIdSS: userId});
        }
    });

    socket.on("disconnect", () => {
        console.log("Socket Disconnected");
        deleteOnlineUser(socket.id);
        // console.log(getAllOnlineUsers());
    });
});

// =======================================SOCKET.IO ENDS=======================================


const {connectDb} = require("./config/database");
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/auth.routes");
const departmentRoutes = require("./routes/department.routes");
const ticketRoutes = require("./routes/ticket.routes");
const chatRoutes  = require("./routes/chat.routes");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// =======================================MAIN API STARTS=======================================
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/department", departmentRoutes);
app.use("/api/v1/ticket", ticketRoutes);
app.use("/api/v1/ticket", chatRoutes);
// =======================================MAIN API ENDS=======================================

connectDb();


const {
    dashboardRouteHandler, 
    departmentRouteHandler,
    ticketsRouteHandler,
    raiseTicketRouteHandler,
    createTicketHandler,
    profileRouteHandler,
    ticketDetailsHandler,
    loginRoutePostHandler,
    viewDepartmentsHandler,
    addDepartmentHandler,
    addUserRouteHandler,

} = require("./webServer");

app.get("/", (req, res) => {
    res.sendFile("index.html");
});

app.get("/login", (req, res) => {
    res.render("login.ejs" , {error: null});
});

// login post handler
app.post("/login", loginRoutePostHandler);

app.get("/dashboard", dashboardRouteHandler);
app.get("/profile", profileRouteHandler);
app.get("/logout", (req, res) => {
    res.clearCookie("token");
    return res.redirect("/login");
});

/*********************************************************************
 ************************* USER ROUTES STARTS ************************
 *********************************************************************/
app.get("/department", departmentRouteHandler);
app.get("/tickets", ticketsRouteHandler);
app.get("/raiseTicket", raiseTicketRouteHandler);

// create ticket post handler
app.post("/ticket/createTicket", createTicketHandler);
app.get("/department/ticket/:id", ticketDetailsHandler);
/*********************************************************************
 ************************* USER ROUTES ENDS **************************
 *********************************************************************/

/*********************************************************************
 ************************* ADMIN ROUTES STARTS ************************
 *********************************************************************/

app.get("/viewDepartments", viewDepartmentsHandler);
app.get("/addDepartment", addDepartmentHandler);
app.get("/addUser", addUserRouteHandler);

/*********************************************************************
 ************************* ADMIN ROUTES ENDS *************************
 *********************************************************************/

server.listen(process.env.PORT, () => {
    console.log(`🚀Server is Running at PORT: ${process.env.PORT}`);
});