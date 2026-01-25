import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
// const users = [
//     {
//         id: 1,
//         username: "admin",
//         password: bcrypt.hashSync("1234", 10),
//         role: "ADMIN"
//     },
//     {
//         id: 2,
//         username: "kitchen",
//         password: bcrypt.hashSync("1234", 10),
//         role: "KITCHEN"
//     }
// ];
export const register = async (req, res) => {
    const { username, password, role } = req.body;
    const exsitsUser = await prisma.user.findUnique({
        where: { username },
    })
    if (exsitsUser) return res.status(402).json({ message: "Username only exsits!" })
    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { username, password: hash, role: role }
    });

    res.json(user);
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Wrong password" });

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({ token, role: user.role });
};

