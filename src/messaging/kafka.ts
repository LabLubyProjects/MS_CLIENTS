import {Kafka} from 'kafkajs';

const kafka = new Kafka({
  clientId: 'ms_clients',
  brokers: ['localhost:9092'],
});

export const kafkaConsumer = kafka.consumer({groupId: 'clients'});
