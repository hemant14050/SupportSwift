const onlineUsers = {};

const setOnlineUser = ({ticketId, userId, socketId, userData}) => {
    onlineUsers[socketId] = {ticketId, userId, userData};
}

const getOnlineUser = ({ticketId, userId}) => {
    for(let socketId in onlineUsers) {
        if(onlineUsers[socketId].ticketId === ticketId && onlineUsers[socketId].userId === userId) {
            return onlineUsers[socketId];
        }
    }
    return null;
}

const getAllOnlineUsers = () => {
    return onlineUsers;
}

const deleteOnlineUser = (socketId) => {
    delete onlineUsers[socketId];
}

module.exports = {
    setOnlineUser, 
    getOnlineUser, 
    getAllOnlineUsers,
    deleteOnlineUser
};