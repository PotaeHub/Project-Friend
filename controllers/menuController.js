import { prisma } from "../config/configPrismaClient.js";

export const getMenus = async (req, res) => {
    try {
        const menus = await prisma.menu.findMany({
            include: { category: true },
        });
        res.json(menus);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "ไม่สามารถดึงเมนูได้" });
    }
};

export const createMenu = async (req, res) => {
    try {
        const { name, price, image, categoryId } = req.body;
        const menu = await prisma.menu.create({
            data: { name, price, image, categoryId },
        });
        res.status(200).json(menu);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "สร้างเมนูล้มเหลว" });
    }
};
