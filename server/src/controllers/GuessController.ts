import { prisma } from "../lib/prisma";

class GuessController {
    async count() {
        const count = await prisma.guess.count();

        return {
            count,
        };
    }
}

export default new GuessController();
