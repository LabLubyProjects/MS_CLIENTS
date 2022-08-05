import { prisma } from "../../prisma/prisma";
import UseCase from "./UseCase";

interface DeleteClientInput {
  clientId: string;
}

export default class DeleteClient implements UseCase {
  async execute(input: string) {
    const inputPayload: DeleteClientInput = JSON.parse(input);
    let deletedUser;
    try {
      deletedUser = await prisma.client.findFirst({
        where: {
          id: inputPayload.clientId,
        },
      });
      const addressDelete = prisma.address.deleteMany({
        where: {
          clientId: inputPayload.clientId,
        },
      });
      const deleteUser = prisma.client.delete({
        where: {
          id: inputPayload.clientId,
        },
      });
      await prisma.$transaction([addressDelete, deleteUser]);
    } catch (error) {
      deletedUser = null;
    }

    return deletedUser;
  }
}
