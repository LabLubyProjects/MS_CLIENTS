import DeleteClient from "@src/usecases/deleteClient";
import StoreClient from "@src/usecases/storeClient";
import UpdateClient from "@src/usecases/updateClient";
import UseCase from "@src/usecases/UseCase";
import { Consumer, Kafka, Producer } from "kafkajs";

let subscribedTopics: string[] = [];

const kafka = new Kafka({
  clientId: "ms_clients",
  brokers: [`${process.env.KAFKA_CONNECTION}`],
});

export class KafkaSingleton {
  static _consumer: Consumer | null = null;
  static _producer: Producer | null = null;

  static async getConsumer() {
    if (this._consumer) return this._consumer;
    this._consumer = kafka.consumer({ groupId: "clients" });
    await this._consumer.connect();
    return this._consumer;
  }

  static async getProducer() {
    if (this._producer) return this._producer;
    this._producer = kafka.producer();
    await this._producer.connect();
    return this._producer;
  }

  public static async shutdown() {
    if (this._consumer) {
      await this._consumer.disconnect();
      this._consumer = null;
      subscribedTopics = [];
    }
    if (this._producer) {
      await this._producer.disconnect();
      this._producer = null;
    }
  }
}

function isAlreadySubscribed(topic: string): boolean {
  return subscribedTopics.includes(topic);
}

export async function consume(topics: string[]) {
  const consumer = await KafkaSingleton.getConsumer();
  topics.forEach((topic) => {
    if (!isAlreadySubscribed(topic)) {
      subscribedTopics.push(topic);
      consumer.subscribe({ topics });
    }
  });
  await consumer.run({
    eachMessage: async ({ message, topic }) => {
      let useCase: UseCase;
      switch (topic) {
        case "store-client":
          useCase = new StoreClient();
          break;
        case "delete-client":
          useCase = new DeleteClient();
          break;
        case "update-client":
          useCase = new UpdateClient();
          break;
      }
      await useCase!.execute(message.value?.toString());
    },
  });
}

export async function produce(message: any, topic: string): Promise<void> {
  const producer = await KafkaSingleton.getProducer();
  await producer.send({
    topic: topic,
    acks: 0,
    messages: [{ value: JSON.stringify(message) }],
  });
}
