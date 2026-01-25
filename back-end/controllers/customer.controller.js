import { prisma } from "../config/db.js";
export const getCustomerMenus = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                menus: true
            }
        });

        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: "Load menu failed" });
    }
};
export const getCustomerCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { id: "asc" }
        });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getOrderHistoryByTable = async (req, res) => {
    try {
        const tableNumber = Number(req.params.tableNumber);

        const orders = await prisma.order.findMany({
            where: { tableNumber },
            orderBy: { createdAt: "desc" },
            include: {
                items: {
                    include: {
                        menu: {
                            select: {
                                name: true,
                                price: true
                            }
                        }
                    }
                }
            }
        });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
