import { z } from "zod";
import ShortUniqueId from "short-unique-id";
import { FastifyRequest, FastifyReply } from "fastify";

import { prisma } from "../lib/prisma";

class PollController {
    async count() {
        const count = await prisma.poll.count();

        return {
            count,
        };
    }

    async createPoll(request: FastifyRequest, reply: FastifyReply) {
        const createPollBody = z.object({
            title: z.string(),
        });

        try {
            const { title } = createPollBody.parse(request.body);

            const generate = new ShortUniqueId({ length: 6 });
            const code = String(generate()).toUpperCase();

            try {
                await request.jwtVerify();

                await prisma.poll.create({
                    data: {
                        title,
                        code,
                        ownerId: request.user.sub,

                        participants: {
                            create: {
                                userId: request.user.sub,
                            },
                        },
                    },
                });
            } catch {
                await prisma.poll.create({
                    data: {
                        title,
                        code,
                    },
                });
            }

            return reply.status(201).send({
                code,
            });
        } catch (error) {
            return reply.status(403).send({
                message: "invalid data",
            });
        }
    }

    async joinToPoll(request: FastifyRequest, reply: FastifyReply) {
        const joinPollBody = z.object({
            code: z.string(),
        });

        const { code } = joinPollBody.parse(request.body);

        const poll = await prisma.poll.findUnique({
            where: {
                code,
            },
            include: {
                participants: {
                    where: {
                        userId: request.user.sub,
                    },
                },
            },
        });

        if (!poll) {
            return reply.status(400).send({
                message: "Pool not found",
            });
        }

        if (poll.participants.length > 0) {
            return reply.status(400).send({
                message: "You already joined this poll",
            });
        }

        if (!poll.ownerId) {
            await prisma.poll.update({
                where: {
                    id: poll.id,
                },
                data: {
                    ownerId: request.user.sub,
                },
            });
        }

        await prisma.participant.create({
            data: {
                pollId: poll.id,
                userId: request.user.sub,
            },
        });

        return reply.status(201).send();
    }

    async myPolls(request: FastifyRequest, reply: FastifyReply) {
        const polls = await prisma.poll.findMany({
            where: {
                participants: {
                    some: {
                        userId: request.user.sub,
                    },
                },
            },
            include: {
                _count: {
                    select: {
                        participants: true,
                    },
                },
                participants: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                avatarUrl: true,
                            },
                        },
                    },
                    take: 4,
                },
                owner: {
                    select: { id: true, name: true },
                },
            },
        });

        return { polls };
    }
}

export default new PollController();
