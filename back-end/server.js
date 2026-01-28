import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { readdirSync } from "fs";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { emitDashboard } from "./controllers/emitDashboard.js";
import { startTableTimer } from "./socket/timer.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use("/uploads", express.static("uploads"));
export const io = new Server(server, {
    cors: {
        origin: process.env.ORIGIN_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.set("io", io);

app.use(cors({
    origin: process.env.ORIGIN_URL,
    credentials: true
}));
app.use(express.json());


readdirSync("./routes").forEach(async (file) => {
    const route = await import(`./routes/${file}`);
    app.use("/api", route.default);
});

io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    // 🟢 ลูกค้า (ไม่มี token)
    if (!token) {
        socket.user = { role: "CUSTOMER" };
        return next();
    }

    // 🔐 admin / kitchen
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
    } catch {
        next(new Error("INVALID_TOKEN"));
    }
});

const tableCarts = {};

io.on("connection", (socket) => {
    console.log("🔌 connect", socket.id, socket.user.role);

    if (socket.user.role === "ADMIN") socket.join("admin");
    if (socket.user.role === "KITCHEN") socket.join("kitchen");

    socket.on("join-table", ({ sessionId }) => {
        socket.join(`session-${sessionId}`);
    });

    socket.on("update-cart", ({ sessionId, cart }) => {
        tableCarts[sessionId] = cart;

        io.to(`session-${sessionId}`).emit("cart-update", cart);
    });

    socket.on("confirm-order", ({ sessionId }) => {
        delete tableCarts[sessionId];

        io.to("kitchen").emit("order-confirmed", { sessionId });
        io.to("admin").emit("order-confirmed", { sessionId });
    });

    socket.on("disconnect", () => {
        console.log("❌ disconnect", socket.id);
    });
});
startTableTimer();
server.listen(5000, () =>
    console.log("✅ Server running :5000")
);
