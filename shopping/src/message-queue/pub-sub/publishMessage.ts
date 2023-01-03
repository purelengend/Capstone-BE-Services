import { Channel } from "amqplib";
import { EXCHANGE_NAME } from "../../config";

const publishMessage = async (
    channel: Channel,
    queueName: string,
    message: any
) => {
    channel.publish(
        EXCHANGE_NAME,
        queueName,
        Buffer.from(JSON.stringify(message))
    );
    console.log(`Message published to ${queueName} queue, message: ${message}`);
};

export default publishMessage;
