import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { readdirSync } from "fs";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
const app = express();
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: process.env.ORIGIN_URL,
        methods: ["GET", "POST"]
    }
});


app.set("io", io);

app.use(cors({
    origin: process.env.ORIGIN_URL,
    credentials: true
}));
app.use(express.json());

// โหลด routes ทั้งหมด
readdirSync("./routes").forEach(async (file) => {
    const route = await import(`./routes/${file}`);
    app.use("/api", route.default);
});

// เมื่อมี client เชื่อมต่อ socket
const tableCarts = {};

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("update-cart", ({ tableNumber, cart }) => {
        tableCarts[tableNumber] = cart;
        // ส่งให้ client ทุกคนที่ฟังโต๊ะนี้
        io.emit(`cart-update-${tableNumber}`, cart);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server with Socket.io running on port ${PORT}`));
