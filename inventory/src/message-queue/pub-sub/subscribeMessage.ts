import { IService } from '../../service/IService';
import { INVENTORY_SERVICE } from '../../config/index';
import { Channel } from "amqplib";
import { EXCHANGE_NAME } from "../../config";
import { EventPayload } from './../../types/utilTypes';

const subscribeMessage = async (channel: Channel, service: IService) => {
    channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
    const q = await channel.assertQueue('', { exclusive: true });
    console.log(` [*] Waiting for messages in ${q.queue}`);

    channel.bindQueue(q.queue, EXCHANGE_NAME, INVENTORY_SERVICE);
    channel.consume(
        q.queue,
        (msg) => {
            if (msg?.content) {
                const message = msg.content.toString();
                console.log(` [x] Received ${msg.fields.routingKey} : ${message}`);
                const payload: EventPayload = JSON.parse(message);
                service.subscribeEvents(payload);
            }
        },
        { noAck: true }
    );
}

export default subscribeMessage;