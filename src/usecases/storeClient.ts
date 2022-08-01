import { PrismaClient } from "@prisma/client";
import Client, { ClientStatus } from "@src/domain/client";
import axios from "axios";
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
    const prisma = new PrismaClient();
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

    const [, APPROVED, DISAPPROVED] = await prisma.status.findMany();

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

    const valueOfNewClientStatus = await prisma.status.findUnique({
      where: {
        id: newClient.statusId,
      },
    });

    axios.put(`${process.env.LUBY_CASH_BASE_URL}/clients/${newClient.id}`, {
      clientStatus: valueOfNewClientStatus?.value,
    });
  }
}
