import { FastifyInstance } from "fastify";
import GuessController from "../controllers/GuessController";

export async function GuessRoutes(fastify: FastifyInstance) {
    fastify.get("/guesses/count", GuessController.count);
}
