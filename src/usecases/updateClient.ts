import { prisma } from "../../prisma/prisma";
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

    const clientUpdate = prisma.client.update({
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
      },
    });

    const addressUpdate = prisma.address.updateMany({
      where: {
        city: body.city,
        state: body.state,
        zipcode: body.zipcode,
      },
      data: {
        city: body.city,
        state: body.state,
        zipcode: body.zipcode,
      },
    });

    await prisma.$transaction([clientUpdate, addressUpdate]);
  }
}
