const BASE_URL = process.env.BASE_API_URL;

exports.departmentEndpoints = {
    GET_DEPARTMENT_TICKETS_API: BASE_URL + "/ticket/getMyDepartmentTickets",
    GET_ALL_DEPARTMENTS_NAME_API: BASE_URL + "/department/getAllDepartments",
    GET_DEPARTMENT_TICKETS_BY_ID_API: BASE_URL + "/ticket/getTicket/",
}

exports.ticketEndpoints = {
    GET_MY_TICKETS_API: BASE_URL + "/ticket/getMyTickets",
    POST_RAISE_TICKET_API: BASE_URL + "/ticket/createTicket",
}

exports.profileEndpoints = {
    GET_PROFILE_API: BASE_URL + "/auth/getProfile",
}

exports.chatEndpoints = (id) => {
    return {
        GET_CHAT_API: BASE_URL + `/ticket/${id}` + "/chat/getChat",
        POST_CHAT_API: BASE_URL + `/ticket/${id}` + "/chat/postChat",
    }
}

exports.dashboardEndpoints = {
    GET_DASHBOARD_DATA_API: BASE_URL + "/department/getDashboardData",
}

exports.authEndpoints = {
    POST_LOGIN_API: BASE_URL + "/auth/login",
}

exports.adminEndpoints = {
    GET_ALL_USERS_DEPARTMENTS_DATA_API: BASE_URL + "/department/getAllUsersDepartmentsData",
}