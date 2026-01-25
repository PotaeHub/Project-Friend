let io;

export const initSocket = (serverIo) => {
    io = serverIo;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};
