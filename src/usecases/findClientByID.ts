import { PrismaClient } from "@prisma/client";
import UseCase from "./UseCase";

export default class FindClientByID implements UseCase {
  async execute(id: string) {
    const prisma = new PrismaClient();
    const client = await prisma.client.findUnique({
      where: {
        id,
      },
      include: {
        address: true,
      },
    });
    return client;
  }
}
