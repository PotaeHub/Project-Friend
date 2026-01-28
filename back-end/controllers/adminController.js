import { prisma } from "../config/db.js";
// Categoty 
export const adminGetCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                id: "desc",
            },
        });

        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
export const adminGetMenus = async (req, res) => {
    try {
        const menus = await prisma.menu.findMany({
            include: { category: true }
        });
        res.json(menus);
    } catch (error) {
        console.error("CREATE MENU ERROR:", err);
        res.status(500).json({ message: "Create menu failed" });
    }
};
// Menu Admin
export const getMenuById = async (req, res) => {
    try {
        const { id } = req.params;

        const menu = await prisma.menu.findUnique({
            where: { id: Number(id) },
            include: { category: true }
        });

        res.json(menu);
    } catch (err) {
        console.error("GET MENU ERROR:", err);
        res.status(500).json({ message: "Get menu failed" });
    }
};

export const createMenu = async (req, res) => {
    try {
        const { name, categoryId } = req.body;

        const menu = await prisma.menu.create({
            data: {
                name,
                categoryId: Number(categoryId),
                image: req.file
                    ? `/uploads/menus/${req.file.filename}`
                    : null
            }
        });

        res.json(menu);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
export const updateMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, categoryId } = req.body;

        const menu = await prisma.menu.update({
            where: { id: Number(id) },
            data: {
                name,
                categoryId: Number(categoryId),
                ...(req.file && {
                    image: `/uploads/menus/${req.file.filename}`
                })
            }
        });

        res.json(menu);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const deleteMenu = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.menu.delete({
            where: { id: Number(id) }
        });

        res.json({ success: true });
    } catch (err) {
        console.error("DELETE MENU ERROR:", err);
        res.status(500).json({ message: "Delete menu failed" });
    }
};
// Dashboard Admin
export const adminDashboard = async (req, res) => {
    try {
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

        res.json({
            categories: categoryCount,
            menus: menuCount,
            orders: orderCount,
            todayOrders: todayOrderCount,
            pendingOrders,
            doneOrders
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

