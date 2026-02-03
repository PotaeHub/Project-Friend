import { prisma } from "../config/db.js";

/* ===== GET ZONES ===== */
export const getZones = async (req, res) => {
  const zones = await prisma.zone.findMany({
    include: {
      _count: { select: { tables: true } },
    },
    orderBy: { id: "asc" },
  });

  res.json(zones);
};

/* ===== CREATE ZONE ===== */
export const createZone = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "กรุณากรอกชื่อโซน" });

  const zone = await prisma.zone.create({ data: { name } });
  res.json(zone);
};

/* ===== TOGGLE ZONE ===== */
export const toggleZone = async (req, res) => {
  const { id } = req.params;

  const zone = await prisma.zone.findUnique({ where: { id: Number(id) } });
  if (!zone) return res.status(404).json({ message: "ไม่พบโซน" });

  const updated = await prisma.zone.update({
    where: { id: zone.id },
    data: { isActive: !zone.isActive },
  });

  res.json(updated);
};
/* ================= UPDATE ZONE ================= */
export const updateZone = async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;

  const zone = await prisma.zone.update({
    where: { id: Number(id) },
    data: { name, status },
  });

  res.json(zone);
};

/* ================= DELETE ZONE ================= */
export const deleteZone = async (req, res) => {
  const id = Number(req.params.id);

  // ถอดโต๊ะออกจาก zone ก่อน (กันพัง FK)
  await prisma.table.updateMany({
    where: { zoneId: id },
    data: { zoneId: null },
  });

  await prisma.zone.delete({ where: { id } });

  res.json({ message: "Zone deleted" });
};
