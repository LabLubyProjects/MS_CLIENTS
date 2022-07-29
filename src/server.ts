import App from "./http/app";
import dotenv from "dotenv";

dotenv.config();

new App().run(Number(process.env.PORT) || 3000);
