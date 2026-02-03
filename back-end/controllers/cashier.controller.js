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
            include: { package: true },
          },
        },
      },
    },
  });

  const result = tables.map((t) => {
    const session = t.buffetSessions[0] || null;

    return {
      id: t.id,
      number: t.number,
      status: t.status,
      zoneId: t.zoneId, // ⭐ สำคัญมาก
      activeSessionId: session?.id || null,
      packages: session
        ? session.packages.map((p) => ({
          id: p.package.id,
          name: p.package.name,
          price: p.package.price,
          qty: p.qty,
        }))
        : [],
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
  const { tableId, packages } = req.body;
  const cashierId = req.user.id;

  const table = await prisma.table.findUnique({
    where: { id: tableId },
    include: { zone: true },
  });

  if (!table) {
    return res.status(404).json({ message: "ไม่พบโต๊ะ" });
  }

  if (table.zone.status === "CLOSED") {
    return res.status(400).json({ message: "โซนปิดปรับปรุง" });
  }

  if (table.status !== "EMPTY") {
    return res.status(400).json({ message: "โต๊ะไม่ว่าง" });
  }

  // ✅ สร้าง session ใหม่
  const session = await prisma.buffetSession.create({
    data: {
      tableId,
      cashierId,
      status: "ACTIVE",
      startTime: new Date(),
      packages: {
        create: packages, // [{ packageId, qty }]
      },
    },
  });

  // ✅ เปิดโต๊ะ
  await prisma.table.update({
    where: { id: tableId },
    data: { status: "OPEN" },
  });

  req.app.get("io").emit("table:update");
  res.json(session);
};

export const closeTable = async (req, res) => {
  const sessionId = Number(req.params.sessionId);
  const { paymentType, paidAmount } = req.body;

  if (!sessionId) {
    return res.status(400).json({ message: "sessionId ไม่ถูกต้อง" });
  }

  const session = await prisma.buffetSession.findUnique({
    where: { id: sessionId },
    include: {
      packages: { include: { package: true } },
      table: true,
    },
  });

  if (!session || session.status !== "ACTIVE") {
    return res.status(400).json({ message: "Session ไม่ถูกต้อง" });
  }

  const total = session.packages.reduce(
    (sum, p) => sum + p.package.price * p.qty,
    0,
  );

  if (paymentType !== "QR" && paidAmount < total) {
    return res.status(400).json({ message: "เงินไม่พอ" });
  }

  await prisma.buffetSession.update({
    where: { id: session.id },
    data: {
      status: "FINISHED",
      endTime: new Date(),
    },
  });

  await prisma.table.update({
    where: { id: session.tableId },
    data: { status: "EMPTY" },
  });

  req.app.get("io").emit("table:update");
  res.json({ total });
};
export const getTableHistory = async (req, res) => {
  try {
    const sessions = await prisma.buffetSession.findMany({
      where: {
        status: "FINISHED",
      },
      orderBy: {
        endTime: "desc",
      },
      include: {
        table: {
          select: {
            id: true,
            number: true,
          },
        },
        orders: {
          include: {
            items: {
              include: {
                menu: true,
              },
            },
          },
        },
      },
    });

    res.json(sessions);
  } catch (err) {
    console.error("❌ getTableHistory error:", err);
    res.status(500).json({
      message: "ไม่สามารถดึงประวัติการใช้งานได้",
    });
  }
};
export const getTableSummary = async (req, res) => {
  try {
    const { tableId } = req.params;

    const table = await prisma.table.findUnique({
      where: { id: Number(tableId) },
      include: {
        buffetSession: {
          where: { status: "ACTIVE" },
          include: {
            orders: {
              orderBy: { round: "asc" },
              include: {
                items: {
                  include: { menu: true }
                }
              }
            }
          }
        }
      }
    });

    if (!table || !table.buffetSession) {
      return res.status(404).json({ message: "ไม่พบ session" });
    }

    res.json({
      table: table.number,
      orders: table.buffetSession.orders
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Load summary failed" });
  }
};
// ดูสรุปการสั่งของ session ปัจจุบัน
export const getSessionSummary = async (req, res) => {
  const sessionId = Number(req.params.sessionId);

  if (!sessionId) {
    return res.status(400).json({ message: "sessionId ไม่ถูกต้อง" });
  }

  const session = await prisma.buffetSession.findUnique({
    where: { id: sessionId },
    include: {
      table: true,
      orders: {
        include: {
          items: {
            include: {
              menu: true,
            },
          },
        },
        orderBy: { round: "asc" },
      },
    },
  });

  if (!session) {
    return res.status(404).json({ message: "ไม่พบ session" });
  }

  const orders = session.orders.map(o => ({
    id: o.id,
    round: o.round,
    status: o.status,
    items: o.items.map(i => ({
      name: i.menu.name,
      qty: i.qty,
    })),
  }));

  res.json({
    table: session.table.number,
    orders,
  });
};
