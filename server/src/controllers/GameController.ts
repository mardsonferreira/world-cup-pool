import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";

import { prisma } from "../lib/prisma";

class GameController {
    async getGamesFromPoll(request: FastifyRequest, reply: FastifyReply) {
        const getPollParams = z.object({
            id: z.string(),
        });

        const { id } = getPollParams.parse(request.params);

        const games = await prisma.game.findMany({
            orderBy: {
                date: "desc",
            },
            include: {
                guesses: {
                    where: {
                        participant: {
                            userId: request.user.sub,
                            pollId: id,
                        },
                    },
                },
            },
        });

        return {
            games: games.map((game) => {
                return {
                    ...game,
                    guess: game.guesses.length > 0 ? game.guesses[0] : null,
                    guesses: undefined,
                };
            }),
        };
    }
}

export default new GameController();
