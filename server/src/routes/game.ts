import { FastifyInstance } from "fastify";
import GameController from "../controllers/GameController";
import { authenticate } from "../plugins/authenticate";

export async function GameRoutes(fastify: FastifyInstance) {
    fastify.get(
        "/polls/:id/games",
        {
            onRequest: [authenticate],
        },
        GameController.getGamesFromPoll
    );
}
