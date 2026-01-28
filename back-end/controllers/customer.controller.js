import { prisma } from "../config/db.js";
export const getCustomerMenus = async (req, res) => {
    try {
        const menus = await prisma.menu.findMany({
            orderBy: { id: "asc" }
        });

        res.json(menus);
    } catch (err) {
        res.status(500).json({ message: "Load menu failed" });
    }
};
export const getCustomerCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { id: "asc" }
        });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getOrderHistoryByTable = async (req, res) => {
    try {
        const tableNumber = Number(req.params.tableNumber);

        const orders = await prisma.order.findMany({
            where: { tableNumber },
            orderBy: { createdAt: "desc" },
            include: {
                items: {
                    include: {
                        menu: {
                            select: {
                                name: true,
                                price: true
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
export const getActiveSessionByTable = async (req, res) => {
    const tableNumber = Number(req.params.tableNumber);

    try {
        /* หา table ก่อน */
        const table = await prisma.table.findUnique({
            where: { number: tableNumber }
        });

        if (!table) {
            return res.status(404).json({
                message: "Table not found"
            });
        }

        /* หา session ที่ ACTIVE */
        const session = await prisma.buffetSession.findFirst({
            where: {
                tableId: table.id,
                status: "ACTIVE"
            },
            orderBy: {
                startTime: "desc"
            }
        });

        if (!session) {
            return res.json({ active: false });
        }

        res.json({
            active: true,
            session
        });

    } catch (err) {
        console.error("❌ getActiveSessionByTable:", err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

/* ================= ORDER HISTORY ================= */
export const getOrdersBySession = async (req, res) => {
    const sessionId = Number(req.params.sessionId);

    /* 🔥 VALIDATE */
    if (!sessionId || isNaN(sessionId)) {
        return res.status(400).json({
            message: "Invalid sessionId"
        });
    }

    try {
        const orders = await prisma.order.findMany({
            where: {
                buffetSessionId: sessionId
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                items: {
                    include: {
                        menu: true
                    }
                }
            }
        });

        res.json(orders);

    } catch (err) {
        console.error("❌ getOrdersBySession:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
