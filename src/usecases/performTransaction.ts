import { prisma } from "../../prisma/prisma";
import UseCase from "./UseCase";

interface PerformTransactionInput {
  sourceUserId: string;
  targetUserId: string;
  amount: number;
}

export default class PerformTransaction implements UseCase {
  async execute(transactionData: string) {
    const input: PerformTransactionInput = JSON.parse(transactionData);
    const source = await prisma.client.findUnique({
      where: { id: input.sourceUserId },
    });
    if (!source) return false;

    const target = await prisma.client.findUnique({
      where: { id: input.targetUserId },
    });
    if (!target) return false;

    try {
      const updateSourceBalance = prisma.client.update({
        where: {
          id: input.sourceUserId,
        },
        data: {
          current_balance: {
            decrement: input.amount,
          },
        },
      });

      const updateTargetBalance = prisma.client.update({
        where: {
          id: input.targetUserId,
        },
        data: {
          current_balance: {
            increment: input.amount,
          },
        },
      });
      await prisma.$transaction([updateSourceBalance, updateTargetBalance]);
    } catch (error) {
      return false;
    }
    return true;
  }
}
