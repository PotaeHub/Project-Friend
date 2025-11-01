import { prisma } from "../config/configPrismaClient.js";
import { printToKitchen } from "../utils/print.js";

// ✅ สร้างออเดอร์ใหม่
export const createOrder = async (req, res) => {
    try {
        const { tableNumber, items } = req.body;

        const order = await prisma.order.create({
            data: {
                tableNumber,
                items: {
                    create: items.map(i => ({
                        menuId: i.menuId,
                        quantity: i.quantity
                    }))
                }
            },
            include: { items: { include: { menu: true } } }
        });

        // ส่งเข้าครัว
        printToKitchen(order);

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการสร้างออเดอร์" });
    }
};

// ✅ ดึงประวัติการสั่งของโต๊ะ
export const getOrdersByTable = async (req, res) => {
    try {
        const { tableNumber } = req.params;

        const orders = await prisma.order.findMany({
            where: { tableNumber: Number(tableNumber) },
            include: {
                items: { include: { menu: true } },
            },
            orderBy: { createdAt: "desc" }
        });

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "ไม่สามารถดึงประวัติคำสั่งซื้อได้" });
    }
};

// ✅ ดึงรายละเอียดออเดอร์เดียว
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await prisma.order.findUnique({
            where: { id: Number(id) },
            include: { items: { include: { menu: true } } },
        });

        if (!order) {
            return res.status(404).json({ message: "ไม่พบออเดอร์นี้" });
        }

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "ไม่สามารถดึงข้อมูลออเดอร์ได้" });
    }
};
// ✅ ดึงรายการออเดอร์ทั้งหมด
export const getOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: { items: { include: { menu: true } } },
            orderBy: { createdAt: "desc" }
        });
        res.json(orders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "ไม่สามารถดึงข้อมูลออเดอร์ได้" });
    }
}
//
export const getTableOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            select: {
                id: true,
                tableNumber: true,
                createdAt: true
            },
            orderBy: { createdAt: "desc" }
        });
        res.json(orders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "ไม่สามารถดึงข้อมูลออเดอร์ได้" });
    }
}