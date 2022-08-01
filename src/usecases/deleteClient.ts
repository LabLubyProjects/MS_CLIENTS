import { PrismaClient } from "@prisma/client";
import UseCase from "./UseCase";

interface DeleteClientInput {
  clientId: string;
}

export default class DeleteClient implements UseCase {
  async execute({ clientId }: DeleteClientInput) {
    const prisma = new PrismaClient();
    await prisma.client.delete({
      where: {
        id: clientId,
      },
    });
  }
}
