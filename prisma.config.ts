import { defineConfig } from "prisma"; // Prisma v5+
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
  // ถ้าใช้ migrations
  migrations: {
    path: "prisma/migrations",
  },
});
