import { prisma } from "../config/db.js";
import { printOrder } from "../ulits/print.js";

export const getOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: { items: { include: { menu: true } } },
            orderBy: { createdAt: "desc" },
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getTable_All = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getOrdersTable = async (req, res) => {
    try {
        const { tableNumber } = req.params; // id ของ Order
        const order = await prisma.order.findUnique({
            where: { id: Number(tableNumber) },
            select: { tableNumber: true } // ดึงเฉพาะ tableNumber
        });

        if (!order) return res.status(404).json({ error: "Order ไม่พบ" });

        res.json({ tableNumber: order.tableNumber });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const createOrder = async (req, res) => {
    try {
        const { tableNumber, items } = req.body;
        // ตรวจสอบโต๊ะ ว่าเป็นเลขบวกไม่เกินจำนวนโต๊ะจริง
        if (!tableNumber || tableNumber < 1 || tableNumber > 10) {
            return res.status(400).json({ error: "เลขโต๊ะไม่ถูกต้อง" });
        }
        const order = await prisma.order.create({
            data: {
                tableNumber,
                items: { create: items.map(i => ({ menuId: i.menuId, quantity: i.quantity })) },
            },
            include: { items: { include: { menu: true } } },
        });

        const io = req.app.get("io");
        io.emit("new-order", order);
        // print order to console
        printOrder(order);

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await prisma.order.update({
            where: { id: Number(id) },
            data: { status },
        });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getOrderHistory = async (req, res) => {
    try {
        const history = await prisma.order.findMany({
            include: { items: { include: { menu: true } } },
            orderBy: { createdAt: "desc" },
        });
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
