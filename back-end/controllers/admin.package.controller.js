import { prisma } from "../config/db.js";

export const getPackages = async (req, res) => {
    try {
        const packages = await prisma.buffetPackage.findMany({
            orderBy: { price: "asc" }
        });
        res.json(packages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// CREATE
export const createPackage = async (req, res) => {
    try {
        const { name, price, timeLimit } = req.body;

        const pkg = await prisma.buffetPackage.create({
            data: {
                name,
                price: Number(price),
                timeLimit: Number(timeLimit)
            }
        });

        res.json(pkg);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE
export const updatePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, timeLimit } = req.body;

        const pkg = await prisma.buffetPackage.update({
            where: { id: Number(id) },
            data: {
                name,
                price: Number(price),
                timeLimit: Number(timeLimit)
            }
        });

        res.json(pkg);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE
export const deletePackage = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.buffetPackage.delete({
            where: { id: Number(id) }
        });

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
