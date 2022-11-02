import { prisma } from "../db";

class UserController {
    async count() {
        const count = await prisma.user.count();

        return {
            count,
        };
    }
}

export default new UserController();
