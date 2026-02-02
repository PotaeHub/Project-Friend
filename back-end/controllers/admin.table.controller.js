import { prisma } from "../config/db.js";

// GET ALL TABLES
export const getTables = async (req, res) => {
    try {
        const tables = await prisma.table.findMany({
            include: {
                zone: true,
            },
            orderBy: { number: "asc" }
        });
        res.json(tables);
    } catch (err) {
        console.error("GET TABLES ERROR:", err);
        res.status(500).json({ message: "Get tables failed" });
    }
};

// CREATE TABLE
export const createTable = async (req, res) => {
    try {
        const { number, zoneId } = req.body;

        if (!number) {
            return res.status(400).json({ message: "Table number is required" });
        }
        if (!zoneId) {
            return res.status(400).json({ message: "Zone is required" });
        }

        const exists = await prisma.table.findUnique({
            where: { number: Number(number) }
        });

        if (exists) {
            return res.status(400).json({ message: "Table number already exists" });
        }

        const table = await prisma.table.create({
            data: {
                number: Number(number),
                zoneId: Number(zoneId),
            },
            include: {
                zone: true,
            },
        });

        res.json(table);
    } catch (err) {
        console.error("CREATE TABLE ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};


// UPDATE TABLE STATUS
export const updateTable = async (req, res) => {
    try {
        const { id } = req.params;
        const { number, status, zoneId } = req.body;

        if (status && !["EMPTY", "OPEN"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const table = await prisma.table.update({
            where: { id: Number(id) },
            data: {
                ...(number !== undefined && { number: Number(number) }),
                ...(status && { status }),
                ...(zoneId && { zoneId: Number(zoneId) }),
            },
            include: {
                zone: true,
            },
        });

        res.json(table);
    } catch (err) {
        console.error("UPDATE TABLE ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};


export const deleteTable = async (req, res) => {
    try {
        const tableId = Number(req.params.id);

        // หา buffetSession ทั้งหมดของโต๊ะนี้
        const sessions = await prisma.buffetSession.findMany({
            where: { tableId },
            select: { id: true }
        });

        const sessionIds = sessions.map(s => s.id);

        await prisma.$transaction([
            // 1. OrderItem
            prisma.orderItem.deleteMany({
                where: {
                    order: {
                        buffetSessionId: { in: sessionIds }
                    }
                }
            }),

            // 2. Order
            prisma.order.deleteMany({
                where: {
                    buffetSessionId: { in: sessionIds }
                }
            }),

            // 3. SessionPackage
            prisma.sessionPackage.deleteMany({
                where: {
                    sessionId: { in: sessionIds }
                }
            }),

            // 4. PaymentSlip
            prisma.paymentSlip.deleteMany({
                where: {
                    buffetSessionId: { in: sessionIds }
                }
            }),

            // 5. BuffetSession
            prisma.buffetSession.deleteMany({
                where: {
                    id: { in: sessionIds }
                }
            }),

            // 6. Table
            prisma.table.delete({
                where: { id: tableId }
            })
        ]);

        res.json({ success: true });
    } catch (err) {
        console.error("DELETE TABLE ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};
