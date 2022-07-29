import { kafkaConsumer } from "@src/messaging/kafka";

export default class StoreUser {
  public async execute(): Promise<void> {
    await kafkaConsumer.connect();
    await kafkaConsumer.subscribe({ topic: "store-client" });
    await kafkaConsumer.run({
      eachMessage: async ({ message }) => {
        const body = 
      },
    });
  }
}
