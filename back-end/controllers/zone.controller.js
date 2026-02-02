import { prisma } from "../config/db.js"

/* ================= GET ZONES ================= */
export const getZones = async (req, res) => {
    const zones = await prisma.zone.findMany({
        include: {
            tables: {
                orderBy: { number: "asc" }
            }
        }
    });

    res.json(zones);
};

/* ================= TOGGLE ZONE ================= */
export const toggleZone = async (req, res) => {
    const { id } = req.params;

    const zone = await prisma.zone.findUnique({
        where: { id: Number(id) }
    });

    if (!zone) {
        return res.status(404).json({ message: "ไม่พบโซน" });
    }

    await prisma.zone.update({
        where: { id: Number(id) },
        data: { status: zone.status === "OPEN" ? "CLOSED" : "OPEN" }
    });

    req.app.get("io").emit("table:update");

    res.json({ message: "อัปเดตสถานะโซนแล้ว" });
};