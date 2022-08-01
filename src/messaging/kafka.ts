import UseCase from "@src/usecases/UseCase";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "ms_clients",
  brokers: ["localhost:9092"],
});

export const kafkaConsumer = kafka.consumer({ groupId: "clients" });
export const kafkaProducer = kafka.producer();

export async function consume(useCase: UseCase, ...topics: string[]) {
  await kafkaConsumer.connect();
  await kafkaConsumer.subscribe({ topics });
  await kafkaConsumer.run({
    eachMessage: async ({ message }) =>
      useCase.execute(message.value?.toString()),
  });
  await kafkaConsumer.disconnect();
}

export async function produce(message: any, topic: string): Promise<void> {
  await kafkaProducer.connect();
  await kafkaProducer.send({
    topic: topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  await kafkaProducer.disconnect();
}
