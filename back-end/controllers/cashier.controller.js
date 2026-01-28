import * as cashierService from "../services/cashier.service.js";
import { prisma } from "../config/db.js";

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

export const getPackages = async (req, res) => {
    const packages = await prisma.buffetPackage.findMany();
    res.json(packages);
};

export const openTable = async (req, res) => {
    const { tableId, packages } = req.body;
    const cashierId = req.user.id;

    const table = await prisma.table.findUnique({ where: { id: tableId } });
    if (table.status === "OPEN") {
        return res.status(400).json({ message: "โต๊ะนี้เปิดอยู่แล้ว" });
    }

    const session = await prisma.buffetSession.create({
        data: {
            status: "ACTIVE",
            cashier: {
                connect: { id: cashierId }
            },
            table: {
                connect: { id: tableId }
            },
            packages: {
                create: [
                    { packageId: 2, qty: 1 },
                    { packageId: 1, qty: 1 }
                ]
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
        data: { status: "OPEN" }
    });

    req.app.get("io").emit("table:update");
    res.json(session);
};


export const closeTable = async (req, res) => {
    const { sessionId } = req.params;
    const { paidAmount, paymentType } = req.body;

    const session = await prisma.buffetSession.findUnique({
        where: { id: Number(sessionId) },
        include: {
            packages: {
                include: { package: true }
            }
        }
    });

    if (!session || session.status !== "ACTIVE") {
        return res.status(400).json({ message: "Session ไม่ถูกต้อง" });
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
