import { prisma } from "../config/db.js";
export const getKitchenOrdersByTable = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: {
                status: "COOKING"
            },
            include: {
                buffetSession: {
                    include: {
                        table: true
                    }
                },
                items: {
                    include: { menu: true }
                }
            },
            orderBy: { createdAt: "asc" }
        });
        const grouped = {};

        orders.forEach(order => {
            const tableNumber = order.buffetSession.table.number;
            if (!grouped[tableNumber]) {
                grouped[tableNumber] = [];
            }
            grouped[tableNumber].push(order);
        });

        res.json(grouped);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Kitchen load failed" });
    }
};
export const doneTableOrders = async (req, res) => {
    try {
        const { tableNumber } = req.params;
        const io = req.app.get("io");

        await prisma.order.updateMany({
            where: {
                status: "COOKING",
                buffetSession: {
                    table: {
                        number: Number(tableNumber)
                    }
                }
            },
            data: {
                status: "DONE"
            }
        });

        io.to("kitchen").emit("table:done", tableNumber);
        io.to(`table-${tableNumber}`).emit("order:done");

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Update failed" });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const io = req.app.get("io");
        const { id } = req.params;
        const { status } = req.body;

        const order = await prisma.order.update({
            where: { id: Number(id) },
            data: { status },
            include: {
                items: { include: { menu: true } },
                buffetSession: { include: { table: true } }
            }
        });

        // 🔥 แจ้ง kitchen ว่ามี order เปลี่ยน
        io.to("kitchen").emit("order:update", order);

        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Update failed" });
    }
};
