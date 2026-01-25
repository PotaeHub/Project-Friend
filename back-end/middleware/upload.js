import multer from "multer";
import fs from "fs";
import path from "path";

const menuDir = "uploads/menus";
if (!fs.existsSync(menuDir)) {
    fs.mkdirSync(menuDir, { recursive: true });
}

const storageMenu = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, menuDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

export const uploadMenu = multer({ storage: storageMenu });
