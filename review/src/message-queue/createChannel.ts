import { EXCHANGE_NAME, MESSAGE_BROKER_URL } from './../config/index';
import amqplib, { Channel, Connection } from 'amqplib';

let amqplibConnection: Connection | null = null;

export const getChannel = async (): Promise<Channel> => {
    if (amqplibConnection === null) {
        amqplibConnection = await amqplib.connect(MESSAGE_BROKER_URL);
    }
    return await amqplibConnection.createChannel();
};

const createChannel = async () => {
    try {
        const channel = await getChannel();
        await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
        return channel;
    } catch (error) {
        console.log('Error in createChannel', error);
        throw error;
    }
};

export default createChannel;
