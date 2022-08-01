import { PrismaClient } from "@prisma/client";
import UseCase from "./UseCase";

interface UpdateClientInput {
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

export default class UpdateClient implements UseCase {
  public async execute(clientData: string): Promise<void> {
    const body: UpdateClientInput = JSON.parse(clientData);
    const prisma = new PrismaClient();

    await prisma.client.update({
      where: {
        id: body.id,
      },
      data: {
        id: body.id,
        full_name: body.fullName,
        cpf_number: body.cpfNumber,
        current_balance: body.currentBalance,
        phone: body.phone,
        email: body.email,
        average_salary: body.averageSalary,
        address: {
          update: {
            city: body.city,
            state: body.state,
            zipcode: body.zipcode,
          },
        },
      },
    });
  }
}
