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

io.on("connection", async (socket) => {
    console.log("🔌", socket.id, socket.user.role);

    if (socket.user.role === "ADMIN") {
        socket.join("admin");
        await emitDashboard();
    }

    if (socket.user.role === "KITCHEN") socket.join("kitchen");

    socket.on("join-table", (tableNumber) => {
        socket.join(`table-${tableNumber}`);
    });

    socket.on("update-cart", ({ tableNumber, cart }) => {
        tableCarts[tableNumber] = cart;

        io.to(`table-${tableNumber}`).emit("cart-update", cart);

        io.to("kitchen").emit("kitchen-cart-update", {
            tableNumber,
            cart
        });
    });

    socket.on("confirm-order", async ({ tableNumber }) => {
        io.to("kitchen").emit("order-confirmed", {
            tableNumber
        });

        io.to("admin").emit("order-confirmed", {
            tableNumber
        });
        await emitDashboard();
    });

    socket.on("disconnect", () => {
        console.log("❌ disconnect", socket.id);
    });
});
startTableTimer();
server.listen(5000, () =>
    console.log("✅ Server running :5000")
);
