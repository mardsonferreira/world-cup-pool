import { z } from "zod";
import ShortUniqueId from "short-unique-id";
import { FastifyRequest, FastifyReply } from "fastify";

import { prisma } from "../db";

class PoolController {
    async count() {
        const count = await prisma.pool.count();

        return {
            count,
        };
    }

    async save(request: FastifyRequest, reply: FastifyReply) {
        const createPoolBody = z.object({
            title: z.string(),
        });

        try {
            const { title } = createPoolBody.parse(request.body);

            const generate = new ShortUniqueId({ length: 6 });
            const code = String(generate()).toUpperCase();

            await prisma.pool.create({
                data: {
                    title,
                    code,
                },
            });

            return reply.status(201).send({
                code,
            });
        } catch (error) {
            return reply.status(403).send({
                message: "invalid data",
            });
        }
    }
}

export default new PoolController();
