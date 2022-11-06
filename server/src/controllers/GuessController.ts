import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";

import { prisma } from "../lib/prisma";

class GuessController {
    async count() {
        const count = await prisma.guess.count();

        return {
            count,
        };
    }

    async createGuess(request: FastifyRequest, reply: FastifyReply) {
        const createGuessParams = z.object({
            pollId: z.string(),
            gameId: z.string(),
        });

        const createGuessBody = z.object({
            firstTeamPoints: z.number(),
            secondTeamPoints: z.number(),
        });

        const { pollId, gameId } = createGuessParams.parse(request.params);
        const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(
            request.body
        );

        const participant = await prisma.participant.findUnique({
            where: {
                userId_pollId: {
                    pollId,
                    userId: request.user.sub,
                },
            },
        });

        if (!participant) {
            return reply.status(400).send({
                message:
                    "You're not allowed to create a guess inside this poll.",
            });
        }

        const guess = await prisma.guess.findUnique({
            where: {
                participantId_gameId: {
                    participantId: participant.id,
                    gameId,
                },
            },
        });

        if (guess) {
            return reply.status(400).send({
                message: "You already sent a guess to this game on this poll.",
            });
        }

        const game = await prisma.game.findUnique({
            where: {
                id: gameId,
            },
        });

        if (!game) {
            return reply.status(400).send({
                message: "Game not found.",
            });
        }

        if (game.date < new Date()) {
            return reply.status(400).send({
                message: "You cannot send guesses after the game date.",
            });
        }

        await prisma.guess.create({
            data: {
                gameId,
                participantId: participant.id,
                firstTeamPoints,
                secondTeamPoints,
            },
        });

        return reply.status(201).send();
    }
}

export default new GuessController();
