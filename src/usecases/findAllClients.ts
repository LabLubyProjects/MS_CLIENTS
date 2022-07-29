import { PrismaClient, Status } from "@prisma/client";
import UseCase from "./UseCase";

export default class FindAllClients implements UseCase {
  async execute(status?: Status, from: Date, to: Date) {
    const prisma = new PrismaClient();
    const allUsersWithAddresses = 
  }
}
