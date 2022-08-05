import FindClientByID from "@src/usecases/findClientByID";
import { Router, Request, Response } from "express";
import PerformTransaction from "@src/usecases/performTransaction";

const router: Router = Router();

router.get("/clients/:id", async (req: Request, res: Response) => {
  const clientId = req.params.id;
  const client = await new FindClientByID().execute(clientId);
  if (!client) return res.status(404).json({ message: "Client not found" });
  return res.json(client);
});

router.post("/transaction", async (req: Request, res: Response) => {
  const transactionBody = req.body;
  const resultOfTransaction = await new PerformTransaction().execute(
    JSON.stringify(transactionBody)
  );

  if (!resultOfTransaction)
    return res.status(400).json({ message: "Transaction failed" });

  return res
    .status(201)
    .json({ message: "Transaction completed successfully" });
});

export default router;
