import { prisma } from "../../prisma/prisma";
import Client, { ClientStatus } from "@src/domain/client";
import { produce } from "@src/messaging/kafka";
import UseCase from "./UseCase";

interface StoreClientInput {
  id: string;
  fullName: string;
  cpfNumber: string;
  currentBalance: number;
  phone: string;
  email: string;
  averageSalary: number;
  city: string;
  state: string;
  zipcode: string;
}

export default class StoreClient implements UseCase {
  public async execute(clientData: string): Promise<void> {
    const body: StoreClientInput = JSON.parse(clientData);
    const client = await prisma.client.findFirst({
      where: {
        OR: [{ email: body.email }, { cpf_number: body.cpfNumber }],
      },
    });

    if (client) return;

    const domainClient = new Client(
      body.id,
      body.fullName,
      body.cpfNumber,
      body.currentBalance,
      body.phone,
      body.email,
      body.averageSalary,
      ClientStatus.PENDING
    );

    const APPROVED = await prisma.status.findUnique({
      where: {
        value: "approved",
      },
    });

    const DISAPPROVED = await prisma.status.findUnique({
      where: {
        value: "disapproved",
      },
    });

    const newClient = await prisma.client.create({
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
              ? { id: APPROVED!.id }
              : { id: DISAPPROVED!.id },
        },
        addresses: {
          create: [
            {
              city: body.city,
              state: body.state,
              zipcode: body.zipcode,
            },
          ],
        },
      },
    });

    const valueOfNewClientStatus = await prisma.status.findUnique({
      where: {
        id: newClient.statusId,
      },
    });

    await produce(
      {
        userId: domainClient.id,
        statusValue: valueOfNewClientStatus?.value,
      },
      "update-client-status"
    );

    await produce(
      {
        id: domainClient.id,
        name: domainClient.fullName,
        email: domainClient.email,
        status: valueOfNewClientStatus?.value,
      },
      "new-clients"
    );
  }
}
