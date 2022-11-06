import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import jwt from "@fastify/jwt";

import { PoolRoutes } from "./routes/poll";
import { UserRoutes } from "./routes/user";
import { GuessRoutes } from "./routes/guess";
import { AuthRoutes } from "./routes/auth";
import { GameRoutes } from "./routes/game";

import { configs } from "./config/configuration";

async function bootstrap() {
    const fastify = Fastify({
        logger: true,
    });

    await fastify.register(fastifyCors, {
        origin: true,
    });

    await fastify.register(jwt, {
        secret: configs.secretKey,
    });

    await fastify.register(PoolRoutes);
    await fastify.register(UserRoutes);
    await fastify.register(GuessRoutes);
    await fastify.register(AuthRoutes);
    await fastify.register(GameRoutes);

    await fastify.listen({
        port: 3333,
        host: "0.0.0.0",
    });
}

bootstrap();
