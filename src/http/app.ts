import express from "express";

export default class App {
  server: express.Application;

  constructor() {
    this.server = express();
    this.server.use(express.json());
  }

  run(port: number) {
    this.server.listen(port, () => console.log("Listening on port " + port));
  }
}
