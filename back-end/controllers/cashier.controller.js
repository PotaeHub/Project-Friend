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

    const result = tables.map(t => {
        const session = t.buffetSessions[0] || null;

        return {
            id: t.id,
            number: t.number,
            status: t.status,
            zoneId: t.zoneId,              // ⭐ สำคัญมาก
            activeSessionId: session?.id || null,
            packages: session
                ? session.packages.map(p => ({
                    id: p.package.id,
                    name: p.package.name,
                    price: p.package.price,
                    qty: p.qty
                }))
                : []
        };
    });

    res.json(result);
};



/* ================= PACKAGES ================= */
export const getPackages = async (req, res) => {
    const packages = await prisma.buffetPackage.findMany();
    res.json(packages);
};

/* ================= OPEN TABLE ================= */

export const openTable = async (req, res) => {
    const { tableId, packages } = req.body
    const cashierId = req.user.id

    const table = await prisma.table.findUnique({
        where: { id: tableId },
        include: { zone: true }
    })

    if (!table) return res.status(404).json({ message: "ไม่พบโต๊ะ" })
    if (table.zone.status === "CLOSED")
        return res.status(400).json({ message: "โซนปิดปรับปรุง" })
    if (table.status === "OPEN")
        return res.status(400).json({ message: "โต๊ะถูกเปิดแล้ว" })

    const session = await prisma.buffetSession.create({
        data: {
            status: "ACTIVE",
            tableId,
            cashierId,
            packages: {
                create: packages
            }
        }
    })

    await prisma.table.update({
        where: { id: tableId },
        data: { status: "OPEN" }
    })

    req.app.get("io").emit("table:update")
    res.json(session)
}

export const closeTable = async (req, res) => {
    const sessionId = Number(req.params.sessionId)
    const { paymentType, paidAmount } = req.body

    const session = await prisma.buffetSession.findUnique({
        where: { id: sessionId },
        include: {
            packages: { include: { package: true } },
            table: true
        }
    })

    if (!session || session.status !== "ACTIVE") {
        return res.status(400).json({ message: "Session ไม่ถูกต้อง" })
    }

    const total = session.packages.reduce(
        (s, p) => s + p.package.price * p.qty,
        0
    )

    if (paymentType !== "QR" && paidAmount < total) {
        return res.status(400).json({ message: "เงินไม่พอ" })
    }

    await prisma.buffetSession.update({
        where: { id: session.id },
        data: { status: "FINISHED", endTime: new Date() }
    })

    await prisma.table.update({
        where: { id: session.tableId },
        data: { status: "EMPTY" }
    })

    req.app.get("io").emit("table:update")

    res.json({ total })
}
