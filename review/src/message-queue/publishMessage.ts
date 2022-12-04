import { EXCHANGE_NAME } from './../config/index';
import { Channel } from 'amqplib';

export const publishMessage = (
    channel: Channel,
    queueName: string,
    message: string
) => {
    channel.publish(
        EXCHANGE_NAME,
        queueName,
        Buffer.from(JSON.stringify(message))
    );
    console.log(`Message published to ${queueName} queue, msg: ${message}`);
};
