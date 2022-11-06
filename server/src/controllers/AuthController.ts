import { z } from "zod";
import fetch from "node-fetch";
import { FastifyRequest, FastifyReply } from "fastify";

import { prisma } from "../lib/prisma";

class AuthController {
    async get(request: FastifyRequest, reply: FastifyReply) {
        return { user: request.user };
    }

    async login(request: FastifyRequest, reply: FastifyReply) {
        const createUserBody = z.object({
            access_token: z.string(),
        });

        const { access_token } = createUserBody.parse(request.body);

        const userResponse = await fetch(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        const userData = await userResponse.json();

        const userInfoSchema = z.object({
            id: z.string(),
            email: z.string().email(),
            name: z.string(),
            picture: z.string().url(),
        });

        const userInfo = userInfoSchema.parse(userData);

        let user = await prisma.user.findUnique({
            where: {
                googleId: userInfo.id,
            },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    googleId: userInfo.id,
                    name: userInfo.name,
                    email: userInfo.email,
                    avatarUrl: userInfo.picture,
                },
            });
        }

        const fastify = request.server;

        const token = fastify.jwt.sign(
            {
                name: user.name,
                avatarUrl: user.avatarUrl,
            },
            {
                sub: user.id,
                expiresIn: "7 days",
            }
        );

        return {
            token,
        };
    }
}

export default new AuthController();
