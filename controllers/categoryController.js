import { prisma } from "../config/configPrismaClient.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({

            include: { menus: true },
        });
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "ไม่สามารถดึงหมวดหมู่ได้" });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await prisma.category.create({ data: { name } });
        res.status(201).json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "สร้างหมวดหมู่ล้มเหลว" });
    }
};
