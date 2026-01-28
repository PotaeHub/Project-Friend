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
// export const getOrderHistoryByTable = async (req, res) => {
//     try {
//         const tableNumber = Number(req.params.tableNumber);

//         const orders = await prisma.order.findMany({
//             where: { tableNumber },
//             orderBy: { createdAt: "desc" },
//             include: {
//                 items: {
//                     include: {
//                         menu: {
//                             select: {
//                                 name: true,
//                                 price: true
//                             }
//                         }
//                     }
//                 }
//             }
//         });

//         res.json(orders);
//     } catch (err) {
//         res.status(500).json({ message: "Server error" });
//     }
// };
export const getActiveSessionByTable = async (req, res) => {
    const rawTableNumber = req.params.tableNumber;

    console.log("params =", req.params);

    // 🔥 เช็คว่ามาไหม
    if (!rawTableNumber || rawTableNumber === "undefined") {
        return res.status(400).json({
            message: "tableNumber is required"
        });
    }

    const tableNumber = Number(rawTableNumber);

    // 🔥 เช็คว่าเป็นตัวเลขจริง
    if (!Number.isInteger(tableNumber)) {
        return res.status(400).json({
            message: "Invalid tableNumber"
        });
    }
    try {
        const table = await prisma.table.findUnique({
            where: { number: tableNumber }
        });

        if (!table) {
            return res.status(404).json({ message: "Table not found" });
        }

        const session = await prisma.buffetSession.findFirst({
            where: {
                tableId: table.id,
                status: "ACTIVE"
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
    try {
        const sessionId = Number(req.params.sessionId);

        if (!sessionId) {
            return res.status(400).json({ message: "sessionId missing" });
        }

        const orders = await prisma.order.findMany({
            where: {
                buffetSessionId: sessionId
            },
            include: {
                items: {
                    include: { menu: true }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json(orders);

    } catch (err) {
        console.error("GET ORDERS ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};
