import { prisma } from "../../prisma/prisma";
import UseCase from "./UseCase";

export default class FindClientByID implements UseCase {
  async execute(id: string) {
    const client = await prisma.client.findUnique({
      where: {
        id,
      },
      include: {
        addresses: true,
      },
    });
    return client;
  }
}
