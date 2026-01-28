import { prisma } from "../config/db.js";

// GET ALL TABLES
export const getTables = async (req, res) => {
    try {
        const tables = await prisma.table.findMany({
            orderBy: { number: "asc" }
        });
        res.json(tables);
    } catch (err) {
        console.error("GET TABLES ERROR:", err);
        res.status(500).json({ message: "Get tables failed" });
    }
};

// CREATE TABLE
export const createTable = async (req, res) => {
    try {
        const { number } = req.body;

        if (!number) {
            return res.status(400).json({ message: "Table number is required" });
        }

        const exists = await prisma.table.findUnique({
            where: { number: Number(number) }
        });

        if (exists) {
            return res.status(400).json({ message: "Table number already exists" });
        }

        const table = await prisma.table.create({
            data: { number: Number(number) }
        });

        res.json(table);
    } catch (err) {
        console.error("CREATE TABLE ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// UPDATE TABLE STATUS
export const updateTable = async (req, res) => {
    try {
        const { id } = req.params;
        const { number, status } = req.body;
        if (!["EMPTY", "OPEN"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        const table = await prisma.table.update({
            where: { id: Number(id) },
            data: {
                ...(number !== undefined && { number: Number(number) }),
                ...(status && { status })
            }
        });

        res.json(table);
    } catch (err) {
        console.error("UPDATE TABLE ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// DELETE TABLE
export const deleteTable = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.table.delete({
            where: { id: Number(id) }
        });

        res.json({ success: true });
    } catch (err) {
        console.error("DELETE TABLE ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};
