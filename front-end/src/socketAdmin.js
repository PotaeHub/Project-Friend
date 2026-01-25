import { io } from "socket.io-client";

const token = localStorage.getItem("token");

const socketAdmin = io("http://localhost:5000", {
    transports: ["websocket"],
    auth: { token },
});

export default socketAdmin;
