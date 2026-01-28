import { prisma } from "../config/db.js";
import { printOrder } from "../ulits/print.js";
import { emitDashboard } from "./emitDashboard.js";

export const getOrders = async (req, res) => {
    const orders = await prisma.order.findMany({
        include: { items: { include: { menu: true } } },
        orderBy: { createdAt: "desc" },
    });
    res.json(orders);
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
export const getOrdersByTable = async (req, res) => {
    try {
        const { tableNumber } = req.params;

        const orders = await prisma.order.findMany({
            where: { tableNumber: Number(tableNumber) },
            include: {
                items: { include: { menu: true } }
            },
            orderBy: { createdAt: "desc" }
        });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createOrder = async (req, res) => {
    try {
        const io = req.app.get("io");
        const { tableNumber, items } = req.body;
        const table = await prisma.table.findUnique({
            where: { number: tableNumber },
            include: {
                buffetSessions: {
                    where: { status: "ACTIVE" },
                    take: 1
                }
            }
        });

        if (!table || table.buffetSessions.length === 0) {
            return res.status(400).json({ message: "โต๊ะนี้ยังไม่เปิดบุฟเฟต์" });
        }

        const session = table.buffetSessions[0];
        const order = await prisma.order.create({
            data: {
                buffetSession: {
                    connect: { id: session.id }
                },
                status: "PENDING",
                items: {
                    create: items.map(i => ({
                        menuId: Number(i.menuId),
                        qty: Number(i.qty)
                    }))
                }
            },
            include: {
                items: { include: { menu: true } }
            }
        });


        // 🔥 realtime กลาง
        io.to("kitchen").emit("order:new", order);
        io.to("admin").emit("order:new", order);
        io.to(`table-${tableNumber}`).emit("order:new", order);

        await emitDashboard();

        res.status(201).json(order);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};

// export const updateOrderStatus = async (req, res) => {
//     try {
//         const io = req.app.get("io");
//         const { id } = req.params;
//         let { status } = req.body;

//         const allowedStatus = ["PENDING", "COOKING", "DONE"];

//         if (!allowedStatus.includes(status)) {
//             return res.status(400).json({
//                 message: "Invalid status",
//                 allowedStatus
//             });
//         }

//         const order = await prisma.order.update({
//             where: { id: Number(id) },
//             data: { status },
//             include: { items: { include: { menu: true } } }
//         });

//         // 🔥 realtime broadcast
//         io.to("kitchen").emit("order-updated", order);
//         io.to("admin").emit("order-updated", order);

//         await emitDashboard();

//         res.json(order);
//     } catch (err) {
//         console.error("UPDATE ORDER STATUS ERROR:", err);
//         res.status(500).json({ error: err.message });
//     }
// };

export const updateOrderStatus = async (req, res) => {
    try {
        const io = req.app.get("io");
        const orderId = Number(req.params.id);
        const { status } = req.body;

        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: { items: { include: { menu: true } } }
        });

        io.emit("order:update", order);
        await emitDashboard();

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
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
export const getKitchenOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: {
                status: { not: "DONE" }
            },
            include: {
                items: { include: { menu: true } }
            },
            orderBy: { createdAt: "desc" }
        });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
