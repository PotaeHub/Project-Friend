import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";

// GET USERS
export const getUsers = async (req, res) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            role: true,
            createdAt: true
        }
    });
    res.json(users);
};

// CREATE USER
export const createUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        const hash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                password: hash,
                role
            }
        });

        res.json(user);
    } catch (err) {
        console.error("CREATE USER ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// DELETE USER
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.user.delete({
            where: { id: Number(id) }
        });

        res.json({ success: true });
    } catch (err) {
        console.error("DELETE USER ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};
