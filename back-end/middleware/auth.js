import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    console.log("🔥 AUTH HIT:", req.method, req.originalUrl);

    if (req.method === "OPTIONS") {
        console.log("✅ SKIP OPTIONS");
        return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "no token" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "invalid token" });
    }
};
