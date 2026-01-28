import { prisma } from "../config/db.js";

export async function getTablesWithRemainingTime() {
    const tables = await prisma.table.findMany({
        include: {
            buffetSessions: {
                where: { status: "ACTIVE" },
                include: { package: true },
                orderBy: { startTime: "desc" },
                take: 1
            }
        }
    });

    const now = new Date();

    return tables.map(t => {
        const session = t.buffetSessions[0];

        if (!session) {
            return {
                ...t,
                remainingSeconds: null
            };
        }

        const endTime = new Date(
            session.startTime.getTime() +
            session.package.timeLimit * 60 * 1000
        );

        const remainingSeconds = Math.max(
            Math.floor((endTime - now) / 1000),
            0
        );

        return {
            ...t,
            activeSessionId: session.id,
            remainingSeconds
        };
    });
}
