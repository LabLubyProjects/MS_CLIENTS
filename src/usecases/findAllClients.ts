import { PrismaClient } from "@prisma/client";
import UseCase from "./UseCase";

export default class FindAllClients implements UseCase {
  async execute() {
    const prisma = new PrismaClient();
    const allClientsWithAddresses = await prisma.client.findMany({
      include: {
        address: true,
      },
    });
    return allClientsWithAddresses;
  }
}
