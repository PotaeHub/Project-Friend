import { prisma } from "../config/db.js";
import { io } from "../server.js";

export const emitDashboard = async () => {
    const [
        categoryCount,
        menuCount,
        orderCount,
        todayOrderCount,
        pendingOrders,
        doneOrders
    ] = await Promise.all([
        prisma.category.count(),
        prisma.menu.count(),
        prisma.order.count(),
        prisma.order.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
            }
        }),
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.order.count({ where: { status: "DONE" } })
    ]);

    io.to("admin").emit("dashboard:update", {
        categories: categoryCount,
        menus: menuCount,
        orders: orderCount,
        todayOrders: todayOrderCount,
        pendingOrders,
        doneOrders
    });

};
