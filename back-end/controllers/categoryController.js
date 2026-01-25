import { prisma } from "../config/db.js";
import fs from "fs";
import path from "path";


export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const category = await prisma.category.create({
            data: {
                name,
                // image: req.file
                //     ? `/uploads/categories/${req.file.filename}`
                //     : null
            }
        });

        res.status(201).json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Create category failed" });
    }
};
export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { createdAt: "desc" }
        });

        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: "Get categories failed" });
    }
};
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await prisma.category.findUnique({
            where: { id: Number(id) }
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json(category);
    } catch (err) {
        res.status(500).json({ message: "Get category failed" });
    }
};
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const old = await prisma.category.findUnique({
            where: { id: Number(id) }
        });

        if (!old) {
            return res.status(404).json({ message: "Category not found" });
        }

        // // ลบรูปเก่า ถ้ามีอัปใหม่
        // if (req.file && old.image) {
        //     const oldPath = path.join(process.cwd(), old.image);
        //     if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        // }

        const category = await prisma.category.update({
            where: { id: Number(id) },
            data: {
                name,
                // image: req.file
                //     ? `/uploads/categories/${req.file.filename}`
                //     : old.image
            }
        });

        res.json(category);
    } catch (err) {
        res.status(500).json({ message: "Update category failed" });
    }
};
export const deleteCategory = async (req, res) => {
    try {
        const id = Number(req.params.id);

        console.log("DELETE ID:", id); // 👈 debug

        const category = await prisma.category.findUnique({
            where: { id },
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        await prisma.category.delete({
            where: { id },
        });

        res.json({ message: "Deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Delete failed" });
    }
};

