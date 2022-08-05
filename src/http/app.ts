import express from "express";
import router from "./routes";

export default class App {
  server: express.Application;

  constructor() {
    this.server = express();
    this.server.use(express.json());
    this.server.use(router);
  }

  run(port: number) {
    return this.server.listen(port, () =>
      console.log("Listening on port " + port)
    );
  }
}
