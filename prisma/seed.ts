import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient({});
  await prisma.status.createMany({
    data: [
      {
        value: "pending",
      },
      {
        value: "approved",
      },
      {
        value: "disapproved",
      },
    ],
  });
}

main();
