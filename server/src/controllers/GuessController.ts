import { prisma } from "../db";

class GuessController {
    async count() {
        const count = await prisma.guess.count();

        return {
            count,
        };
    }
}

export default new GuessController();
