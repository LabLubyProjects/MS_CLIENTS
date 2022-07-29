import UseCase from "@src/usecases/UseCase";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "ms_clients",
  brokers: ["localhost:9092"],
});

export const kafkaConsumer = kafka.consumer({ groupId: "clients" });

export async function consume(useCase: UseCase, ...topics: string[]) {
  await kafkaConsumer.connect();
  await kafkaConsumer.subscribe({ topics });
  await kafkaConsumer.run({
    eachMessage: async ({ message }) => useCase.execute(message),
  });
  await kafkaConsumer.disconnect();
}
