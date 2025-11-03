import {prisma} from "../config/db.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await prisma.category.create({ data: { name } });
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
