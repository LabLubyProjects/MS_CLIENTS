import { prisma } from "../../prisma/prisma";
import UseCase from "./UseCase";
export default class DeleteClient implements UseCase {
  async execute(clientId: string) {
    let deletedUser;
    try {
      deletedUser = await prisma.client.delete({
        where: {
          id: clientId,
        },
      });
    } catch (error) {
      deletedUser = null;
    }

    return deletedUser;
  }
}
