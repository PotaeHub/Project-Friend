import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { readdirSync } from "fs"
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors({
    origin: process.env.ORIGIN_URL,
}
))
app.use(express.json());
// Dynamic routes
const routeFiles = readdirSync("./routes");

for (const file of routeFiles) {
    try {
        const route = await import(`./routes/${file}`);
        if (route.default) {
            app.use("/api", route.default); // import default router
        } else {
            console.error(`Route file ${file} does not have a default export`);
        }
    } catch (error) {
        console.error(`Error loading route file ${file}:`, error);
    }
}

app.listen(port, () => {
    console.log(`Server Running http://localhost:${port}`)
})