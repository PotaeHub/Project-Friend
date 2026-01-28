import { io } from "../server.js";
import { prisma } from "../config/db.js";

export const startTableTimer = () => {
    setInterval(async () => {
        const tables = await prisma.table.findMany({
            orderBy: { number: "asc" },
            include: {
                buffetSessions: {
                    where: { status: "ACTIVE" },
                    take: 1,
                    include: {
                        packages: {
                            include: {
                                package: true
                            }
                        }
                    }
                }
            }
        });

        const payload = tables.map(t => {
            const s = t.buffetSessions[0];
            if (!s) {
                return {
                    tableId: t.id,
                    remainingSeconds: null
                };
            }

            // 🔥 เวลาสูงสุดจากทุกแพ็กเกจ
            const maxTimeLimit = Math.max(
                ...s.packages.map(p => p.package.timeLimit)
            );

            const endTime =
                new Date(s.startTime).getTime() +
                maxTimeLimit * 60 * 1000;

            const remainingSeconds = Math.max(
                Math.floor((endTime - Date.now()) / 1000),
                0
            );

            return {
                tableId: t.id,
                sessionId: s.id,
                remainingSeconds
            };
        });

        io.emit("table:timer", payload);
    }, 1000);
};
