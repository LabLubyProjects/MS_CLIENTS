import App from "./http/app";
import dotenv from "dotenv";
import { consume } from "./messaging/kafka";
import StoreClient from "./usecases/storeClient";
import DeleteClient from "./usecases/deleteClient";

dotenv.config();

consume(new StoreClient(), "store-client");
consume(new DeleteClient(), "delete-client");
new App().run(Number(process.env.PORT) || 3000);
