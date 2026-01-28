import { prisma } from "../config/db.js";

/* ================= GET TABLES ================= */
export const getTables = async (req, res) => {
    const tables = await prisma.table.findMany({
        orderBy: { number: "asc" },
        include: {
            buffetSessions: {
                where: { status: "ACTIVE" },
                include: {
                    packages: {
                        include: { package: true }
                    }
                }
            }
        }
    });

    res.json(tables);
};

/* ================= PACKAGES ================= */
export const getPackages = async (req, res) => {
    const packages = await prisma.buffetPackage.findMany();
    res.json(packages);
};

/* ================= OPEN TABLE ================= */
export const openTable = async (req, res) => {
    const { tableId, packages } = req.body;
    const cashierId = req.user.id;

    const table = await prisma.table.findUnique({
        where: { id: tableId }
    });

    if (!table) {
        return res.status(404).json({ message: "ไม่พบโต๊ะ" });
    }

    if (table.status === "OPEN") {
        return res.status(400).json({ message: "โต๊ะนี้เปิดอยู่แล้ว" });
    }

    const session = await prisma.buffetSession.create({
        data: {
            status: "ACTIVE",
            cashierId,
            tableId,
            packages: {
                create: packages.map(p => ({
                    packageId: p.packageId,
                    qty: p.qty
                }))
            }
        },
        include: {
            packages: {
                include: { package: true }
            }
        }
    });

    await prisma.table.update({
        where: { id: tableId },
        data: {
            status: "OPEN",
        }
    });

    req.app.get("io").emit("table:update");

    res.json(session);
};

/* ================= CLOSE TABLE ================= */
export const closeTable = async (req, res) => {
    const { sessionId } = req.params; // ใช้แค่อ้างอิง
    const { paidAmount, paymentType } = req.body;


    const session = await prisma.buffetSession.findFirst({
        where: {
            id: Number(sessionId),
            status: "ACTIVE"
        },
        include: {
            packages: { include: { package: true } },
            table: true
        }
    });


    if (!session) {
        return res.status(400).json({
            message: "โต๊ะนี้ยังไม่ได้เปิด หรือถูกปิดไปแล้ว"
        });
    }


    const totalPrice = session.packages.reduce(
        (sum, p) => sum + p.package.price * p.qty,
        0
    );

    if (paidAmount < totalPrice) {
        return res.status(400).json({ message: "เงินไม่พอ" });
    }

    await prisma.buffetSession.update({
        where: { id: session.id },
        data: {
            status: "FINISHED",
            endTime: new Date()
        }
    });


    await prisma.table.update({
        where: { id: session.tableId },
        data: { status: "EMPTY" }
    });

    await prisma.bill.create({
        data: {
            sessionId: session.id,
            totalPrice,
            paidAmount,
            paymentType
        }
    });

    req.app.get("io").emit("table:update");

    res.json({
        totalPrice,
        change: paidAmount - totalPrice
    });
};

