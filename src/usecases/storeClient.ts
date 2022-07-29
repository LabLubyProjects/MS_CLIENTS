import { PrismaClient } from "@prisma/client";
import Client, { ClientStatus } from "@src/domain/client";
import UseCase from "./UseCase";

export default class StoreClient implements UseCase {
  public async execute(clientData: any): Promise<void> {
    const body = JSON.parse(clientData.value!.toString());
    const prisma = new PrismaClient({});
    const client = await prisma.client.findUnique({
      where: {
        email: body.email,
        cpf_number: body.cpfNumber,
      },
    });

    if (client) return;

    const domainClient = new Client(
      body.fullName,
      body.cpfNumber,
      body.currentBalance,
      body.phone,
      body.email,
      body.averageSalary,
      ClientStatus.PENDING
    );

    const [, APPROVED, DISAPPROVED] = await prisma.status.findMany();

    await prisma.client.create({
      data: {
        id: domainClient.id,
        full_name: domainClient.fullName,
        cpf_number: domainClient.cpfNumber,
        current_balance:
          domainClient.status === ClientStatus.APPROVED ? 200 : 0,
        phone: domainClient.phone,
        email: domainClient.email,
        average_salary: domainClient.averageSalary,
        status: {
          connect:
            domainClient.status === ClientStatus.APPROVED
              ? APPROVED
              : DISAPPROVED,
        },
        address: {
          create: {
            city: body.city,
            state: body.state,
            zipcode: body.zipcode,
          },
        },
      },
    });
  }
}
