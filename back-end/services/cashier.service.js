import { prisma } from "../config/db.js";

/**
 * เปิดโต๊ะ (เริ่มบุฟเฟต์)
 */
export const openTable = async ({
    tableId,
    packageId,
    customerQty,
    cashierId
}) => {
    return await prisma.$transaction(async (tx) => {

        // 1. ตรวจว่าโต๊ะว่าง
        const table = await tx.table.findUnique({
            where: { id: tableId }
        });

        if (!table || table.status !== "EMPTY") {
            throw new Error("Table not available");
        }

        // 2. สร้าง BuffetSession
        const session = await tx.buffetSession.create({
            data: {
                tableId,
                packageId,
                customerQty,
                cashierId
            },
            include: {
                table: true,
                package: true
            }
        });

        // 3. เปลี่ยนสถานะโต๊ะ
        await tx.table.update({
            where: { id: tableId },
            data: { status: "OPEN" }
        });

        return session;
    });
};
/**
 * ปิดโต๊ะ (จบบุฟเฟต์)
 */
export const closeTable = async (sessionId) => {
    // 1. หา session
    const session = await prisma.buffetSession.findUnique({
        where: { id: Number(sessionId) },
        include: { table: true }
    });

    if (!session) throw new Error("Session not found");
    if (session.status === "FINISHED") {
        throw new Error("Session already finished");
    }

    // 2. ปิด session
    const updatedSession = await prisma.buffetSession.update({
        where: { id: Number(sessionId) },
        data: {
            status: "FINISHED",
            endTime: new Date()
        }
    });

    // 3. คืนโต๊ะเป็น EMPTY
    await prisma.table.update({
        where: { id: session.tableId },
        data: { status: "EMPTY" }
    });

    return updatedSession;
};
