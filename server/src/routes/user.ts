import { FastifyInstance } from "fastify";
import UserController from "../controllers/UserController";

export async function UserRoutes(fastify: FastifyInstance) {
    fastify.get("/users/count", UserController.count);
}