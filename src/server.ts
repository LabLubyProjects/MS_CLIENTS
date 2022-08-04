import App from "./http/app";
import dotenv from "dotenv";
import { consume, KafkaSingleton } from "./messaging/kafka";

dotenv.config();

consume(["store-client", "delete-client", "update-client"]);
const server = new App().run(Number(process.env.PORT) || 3000);

process.on("SIGTERM", () => {});

(async (): Promise<void> => {
  const exitSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGQUIT"];
  exitSignals.map((sig) =>
    process.on(sig, async () => {
      server.close(() => {
        console.log("Express Server Closed");
      });
      await KafkaSingleton.shutdown();
    })
  );
})();
