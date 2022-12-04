import { EXCHANGE_NAME, REVIEW_SERVICE } from '../config/index';
import { Channel } from 'amqplib';

const subscribeMessage = async (channel: Channel, service: IService) => {
    channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
    const q = await channel.assertQueue('', { exclusive: true });
    console.log(` [*] Waiting for messages in ${q.queue}`);

    channel.bindQueue(q.queue, EXCHANGE_NAME, REVIEW_SERVICE);

    channel.consume(
        q.queue,
        (msg) => {
            if (msg?.content) {
                const message = msg.content.toString();
                console.log(` [x] Received: ${message}`);
                service.subscribeEvents(message);

                // setTimeout(() => {
                //     channel.ack(msg);
                // }, 1000);
            }
        },
        { noAck: true }
    );
};

export default subscribeMessage;
