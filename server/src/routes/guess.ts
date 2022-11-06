import { FastifyInstance } from "fastify";
import GuessController from "../controllers/GuessController";
import { authenticate } from "../plugins/authenticate";

export async function GuessRoutes(fastify: FastifyInstance) {
    fastify.get("/guesses/count", GuessController.count);

    fastify.post(
        "/polls/:pollId/games/:gameId/guesses",
        {
            onRequest: [authenticate],
        },
        GuessController.createGuess
    );
}
