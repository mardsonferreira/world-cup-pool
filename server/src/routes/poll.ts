import { FastifyInstance } from "fastify";

import { authenticate } from "../plugins/authenticate";

import PollController from "../controllers/PollController";

export async function PoolRoutes(fastify: FastifyInstance) {
    fastify.get("/polls/count", PollController.count);

    fastify.get(
        "/polls",
        { onRequest: [authenticate] },
        PollController.myPolls
    );

    fastify.post("/polls", PollController.createPoll);

    fastify.post(
        "/polls/join",
        { onRequest: [authenticate] },
        PollController.joinToPoll
    );

    fastify.get(
        "/polls/:id",
        {
            onRequest: [authenticate],
        },
        PollController.getPoll
    );
}
