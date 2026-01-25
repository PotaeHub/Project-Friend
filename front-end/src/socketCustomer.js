import { io } from "socket.io-client";

const socketCustomer = io("http://localhost:5000", {
    transports: ["websocket"],
});

export default socketCustomer;
