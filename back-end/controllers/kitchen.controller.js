import { prisma } from "../config/db.js";
export const getKitchenOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: "asc" },
            include: {
                items: {
                    include: {
                        menu: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const orderId = Number(req.params.id);

        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });

        // 🔥 realtime
        const io = req.app.get("io");
        io.emit("order-status-updated", order);

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
};
