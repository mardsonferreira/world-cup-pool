import Fastify from "fastify";
import fastifyCors from "@fastify/cors";

import PoolController from "./controllers/PoolController";
import UserController from "./controllers/UserController";
import GuesController from "./controllers/GuessController";

async function bootstrap() {
    const fastify = Fastify({
        logger: true,
    });

    await fastify.register(fastifyCors, {
        origin: true,
    });

    // Pool routes
    fastify.get("/pools/count", PoolController.count);
    fastify.post("/pools", PoolController.save);

    // User routes
    fastify.get("/users/count", UserController.count);

    // Guess routes
    fastify.get("/guesses/count", GuesController.count);

    await fastify.listen({
        port: 3333,
        host: "0.0.0.0",
    });
}

bootstrap();
