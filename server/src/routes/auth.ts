import { FastifyInstance } from "fastify";

import { authenticate } from "../plugins/authenticate";

import AuthController from "../controllers/AuthController";

export async function AuthRoutes(fastify: FastifyInstance) {
    fastify.get(
        "/me",
        {
            onRequest: [authenticate],
        },
        AuthController.get
    );

    fastify.post("/users", AuthController.login);
}
