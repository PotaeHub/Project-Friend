import { prisma } from "../config/db.js";


export const buffetPackages = async (req, res) => {
    try {
        const pkgs = await prisma.buffetPackage.findMany();
        res.json(pkgs);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error!" })
    }
} 