import { prisma } from "../config/db.js";
import { ORDER_LIMIT_PER_ROUND } from "../config/buffet.js";
import { emitDashboard } from "./emitDashboard.js";

export const getOrders = async (req, res) => {
  const orders = await prisma.order.findMany({
    include: { items: { include: { menu: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders);
};

export const getTable_All = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getOrdersByTable = async (req, res) => {
  try {
    const { tableNumber } = req.params;

    const orders = await prisma.order.findMany({
      where: { tableNumber: Number(tableNumber) },
      include: {
        items: { include: { menu: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const createOrder = async (req, res) => {
  try {
    const io = req.app.get("io");
    const { buffetSessionId, items } = req.body;

    if (!buffetSessionId || !items?.length) {
      return res.status(400).json({ message: "Invalid data" });
    }

    /* =========================
      1. Load session + last order
    ========================== */
    const session = await prisma.buffetSession.findUnique({
      where: { id: Number(buffetSessionId) },
      include: {
        orders: {
          where: { status: { not: "DONE" } },
          orderBy: { round: "desc" },
          take: 1,
        },
      },
    });

    if (!session || session.status !== "ACTIVE") {
      return res.status(400).json({ message: "Session not active" });
    }

    const lastOrder = session.orders[0] || null;

    /* =========================
      2. Calculate qty
    ========================== */
    const totalQty = items.reduce(
      (sum, i) => sum + Number(i.qty || 0),
      0
    );

    if (totalQty > ORDER_LIMIT_PER_ROUND) {
      return res.status(400).json({
        message: `สั่งได้ไม่เกิน ${ORDER_LIMIT_PER_ROUND} รายการต่อรอบ`,
      });
    }

    /* =========================
      3. Next round
    ========================== */
    const nextRound = lastOrder ? lastOrder.round + 1 : 1;

    /* =========================
      4. Create order
    ========================== */
    const order = await prisma.order.create({
      data: {
        buffetSessionId: session.id,
        round: nextRound,
        status: "PENDING",
        items: {
          create: items.map((i) => ({
            menuId: Number(i.menuId),
            qty: Number(i.qty),
          })),
        },
      },
      include: {
        items: { include: { menu: true } },
        buffetSession: { include: { table: true } },
      },
    });

    /* =========================
      5. Realtime
    ========================== */
    io.to("kitchen").emit("order:new", order);
    io.to("admin").emit("order:new", order);
    io.to(`session-${session.id}`).emit("order:new", order);

    res.status(201).json(order);
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ message: "Create order failed" });
  }
};
export const getTableSessions = async (req, res) => {
  console.log("PARAMS:", req.params);

  const tableId = parseInt(req.params.tableId, 10); // ✅ ใช้ tableId

  if (isNaN(tableId)) {
    return res.status(400).json({
      message: "tableId ไม่ถูกต้อง",
    });
  }

  const sessions = await prisma.buffetSession.findMany({
    where: {
      tableId: tableId,
    },
    orderBy: {
      startTime: "desc",
    },
    include: {
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
};
export const getAllSessionHistory = async (req, res) => {
  const sessions = await prisma.buffetSession.findMany({
    where: {
      status: "FINISHED",
    },
    orderBy: {
      endTime: "desc",
    },
    include: {
      table: true,
      cashier: {
        select: {
          id: true,
          username: true,
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
      slips: true,
    },
  });

  res.json(sessions);
};
// GET /admin/sessions/history
export const getAdminSessionHistory = async (req, res) => {
  const sessions = await prisma.buffetSession.findMany({
    where: { status: "FINISHED" },
    orderBy: { endTime: "desc" },
    include: {
      table: true,
      cashier: {
        select: { id: true, username: true },
      },
      packages: {
        include: { package: true },
      },
      orders: {
        include: {
          items: { include: { menu: true } },
        },
      },
      slips: true,
    },
  });

  res.json(sessions);
};

// export const updateOrderStatus = async (req, res) => {
//     try {
//         const io = req.app.get("io");
//         const { id } = req.params;
//         let { status } = req.body;

//         const allowedStatus = ["PENDING", "COOKING", "DONE"];

//         if (!allowedStatus.includes(status)) {
//             return res.status(400).json({
//                 message: "Invalid status",
//                 allowedStatus
//             });
//         }

//         const order = await prisma.order.update({
//             where: { id: Number(id) },
//             data: { status },
//             include: { items: { include: { menu: true } } }
//         });

//         // 🔥 realtime broadcast
//         io.to("kitchen").emit("order-updated", order);
//         io.to("admin").emit("order-updated", order);

//         await emitDashboard();

//         res.json(order);
//     } catch (err) {
//         console.error("UPDATE ORDER STATUS ERROR:", err);
//         res.status(500).json({ error: err.message });
//     }
// };

export const updateOrderStatus = async (req, res) => {
  try {
    const io = req.app.get("io");
    const orderId = Number(req.params.id);
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: { include: { menu: true } } },
    });

    io.emit("order:update", order);
    await emitDashboard();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

export const getOrderHistory = async (req, res) => {
  const history = await prisma.order.findMany({
    where: {
      buffetSession: {
        status: "FINISHED",
      },
    },
    include: {
      buffetSession: {
        include: {
          table: true,
        },
      },
      items: { include: { menu: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(history);
};

export const getKitchenOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: { not: "DONE" },
      },
      include: {
        items: { include: { menu: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
