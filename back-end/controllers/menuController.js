import {prisma} from "../config/db.js";

export const getMenus = async (req, res) => {
    try {
        const menus = await prisma.menu.findMany({ include: { category: true } });
        res.json(menus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getMenusByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const menus = await prisma.menu.findMany({
            where: { categoryId: Number(categoryId) },
            include: { category: true },
        });
        res.json(menus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createMenu = async (req, res) => {
    try {
        const { name, price, image, categoryId } = req.body;
        const menu = await prisma.menu.create({
            data: { name, price, image, category: { connect: { id: categoryId } } },
        });
        res.json(menu);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
