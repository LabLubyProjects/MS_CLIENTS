import FindAllClients from "@src/usecases/findAllClients";
import FindClientByID from "@src/usecases/findClientByID";
import DeleteClient from "@src/usecases/deleteClient";
import { Router, Request, Response } from "express";

const router: Router = Router();

router.get("/clients", async (req: Request, res: Response) => {
  const findAllClientsUseCaseResult = await new FindAllClients().execute();
  return res.json(findAllClientsUseCaseResult);
});

router.get("/clients/:id", async (req: Request, res: Response) => {
  const clientId = req.params.id;
  const client = await new FindClientByID().execute(clientId);
  if (!client) return res.status(404).json({ message: "Client not found" });
  return res.json(client);
});

router.delete("/clients/:id", async (req: Request, res: Response) => {
  const clientId = req.params.id;
  const deletedUser = await new DeleteClient().execute(clientId);
  if (!deletedUser)
    return res.status(404).json({ message: "Client not found" });
  return res.json(deletedUser);
});
