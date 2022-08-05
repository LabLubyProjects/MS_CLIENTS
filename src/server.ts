import App from "./http/app";
import dotenv from "dotenv";
import { consume } from "./messaging/kafka";

dotenv.config();

consume(["store-client", "delete-client", "update-client"]);
new App().run(Number(process.env.PORT) || 3000);
