const {
    departmentEndpoints,
    ticketEndpoints,
    profileEndpoints,
    chatEndpoints,
    dashboardEndpoints,
    authEndpoints,
    adminEndpoints,

} = require("./apiUrls");

/**
 * ADMIN ROUTES
 */
const viewDepartmentsHandler = async(req, res) => {
    const token = req.cookies?.token;
    if(!token) {
        return res.redirect("/logout");
    }
    const response = await fetch(adminEndpoints.GET_ALL_USERS_DEPARTMENTS_DATA_API, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    const result = await response.json();
    if(result.success) {
        return res.render("viewDepartments.ejs", {data: {
            returnData: result.returnData,
            user: result.user,
        }});
    } else {
        return res.redirect("/logout");
    }
}

const addDepartmentHandler = async(req, res) => {
    const token = req.cookies?.token;
    if(!token) {
        return res.redirect("/logout");
    }
    const response = await fetch(profileEndpoints.GET_PROFILE_API, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    const result = await response.json();
    if(result.success && result.user.role === "Admin") {
        return res.render("addDepartment.ejs", {data: {
            user: result.user,
        }});
    } else {
        return res.redirect("/logout");
    }
}

const addUserRouteHandler = async(req, res) => {
    const token = req.cookies?.token;
    if(!token) {
        return res.redirect("/logout");
    }
    const response = await fetch(profileEndpoints.GET_PROFILE_API, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    const result = await response.json();

    const response2 = await fetch(departmentEndpoints.GET_ALL_DEPARTMENTS_NAME_API, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    const result2 = await response2.json();

    if(result.success && result.user.role === "Admin") {
        return res.render("addUser.ejs", {data: {
            user: result.user,
            allDepartments: result2.allDepartments,
        }});
    } else {
        return res.redirect("/logout");
    }
}

/**
 * USER ROUTES
 */
const loginRoutePostHandler = async(req, res) => {
    const response = await fetch(authEndpoints.POST_LOGIN_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
    });
    const result = await response.json();
    if(result.success) {
        const options = {
            // set to expires in 2days
            expire: new Date(Date.now() + (2*24*60*60*1000)),
            // cookie access by web-browser only
            httpOnly: true,
        }
        res.cookie("token", result.token, options);
        return res.redirect("/dashboard");
    } else {
        return res.render("login.ejs", {error: result.message});
    }
}

const dashboardRouteHandler = async(req, res) => {
    const token = req.cookies.token;  
    if(!token) {
        return res.redirect("/logout");
    } 
    const response = await fetch(dashboardEndpoints.GET_DASHBOARD_DATA_API, {
        "method": "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });
    const result = await response.json();
    // console.log(result);
    if(result.success) {
        return res.render("dashboard.ejs", {data: {
            dashboardData: result.stats,
            user: result.user,
        }});
    } else {
        return res.redirect("/logout");
    }
}

const departmentRouteHandler = async(req, res) => {
    const token = req.cookies?.token;
    if(!token) {
        return res.redirect("/logout");
    }
    const response = await fetch(departmentEndpoints.GET_DEPARTMENT_TICKETS_API, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });
    const result = await response.json();
    if(result.success) {
        return res.render("department.ejs", {data: {
            departmentData: result.departmentTickets,
            user: result.user,
        }});
    } else {
        return res.redirect("/logout");
    }
}

const ticketsRouteHandler = async(req, res) => {
    const token = req.cookies?.token;
    if(!token) {
        return res.redirect("/logout");
    }
    const response = await fetch(ticketEndpoints.GET_MY_TICKETS_API, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });
    const result = await response.json();
    if(result.success) {
        return res.render("tickets.ejs", {data: {
            ticketsData: result.tickets,
            user: result.user,
        }});
    } else {
        return res.redirect("/logout");
    }
}

const raiseTicketRouteHandler = async(req, res) => {
    const token = req.cookies?.token;
    if(!token) {
        return res.redirect("/logout");
    }
    const response = await fetch(departmentEndpoints.GET_ALL_DEPARTMENTS_NAME_API, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    const result = await response.json();
    if(result.success) {
        return res.render("raiseTicket.ejs", {data: {
            allDepartments: result.allDepartments,
            user: result.user,
        }});
    } else {
        return res.redirect('/raiseTicket/error?message=' + result.message);
    }
}

const createTicketHandler = async(req, res) => {
    const token = req.cookies?.token;
    if(!token) {
        return res.redirect("/logout");
    }
    const response = await fetch(ticketEndpoints.POST_RAISE_TICKET_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(req.body),
    });
    const result = await response.json();
    if(result.success) {
        return res.render("success.ejs", {data: {
            ticketId: result.ticket._id,
            message: result.message,
            user: result.user,
        }});
    } else {
        return res.render("error.ejs", {data: {
            message: result.message,
            user: result.user,
        }});
    }
}

const profileRouteHandler = async(req, res) => {
    const token = req.cookies?.token;
    if(!token) {
        return res.redirect("/logout");
    }
    const response = await fetch(profileEndpoints.GET_PROFILE_API, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });
    const result = await response.json();
    return res.render("profile.ejs", {data: {
        profileData: result.profile,
        user: result.user,
    }});
}

const ticketDetailsHandler = async(req, res) => {
    const token = req.cookies?.token;
    const id = req.params.id;
    if(!token) {
        return res.redirect("/logout");
    }
    const response = await fetch(departmentEndpoints.GET_DEPARTMENT_TICKETS_BY_ID_API + id, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });
    const result = await response.json();

    const chatResponse = await fetch(chatEndpoints(id).GET_CHAT_API, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });
    const chatResult = await chatResponse.json();

    // console.log(result);

    if(result.success && chatResult.success) {
        return res.render("ticketDetails.ejs", { data: {
            ticketData: result?.ticket,
            chatData: chatResult?.chat,
            user: result?.user,
        }});
    } else {
        return res.redirect("/logout");
    }
}

module.exports = {
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
    
}
