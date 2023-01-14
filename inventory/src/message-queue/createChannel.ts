import amqplib, { Channel, Connection } from 'amqplib';
import { EXCHANGE_NAME, MESSAGE_BROKER_URL } from '../config';

let amqplibConnection: Connection | null = null;

export const getChannel = async (): Promise<Channel> => {
    if (!amqplibConnection) {
        amqplibConnection = await amqplib.connect(MESSAGE_BROKER_URL);
    }
    return await amqplibConnection.createChannel();
};

const createChannel = async (): Promise<Channel> => {
    try {
        const channel = await getChannel();
        await channel.assertExchange(EXCHANGE_NAME, 'direct', {
            durable: true,
        });
        return channel;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export default createChannel;

/* 
    const channel = await getChannel();
    await channel.assertExchange('CAPSTONE_EXCHANGE', 'topic', { durable: true });
    await channel.assertQueue('REVIEW_SERVICE', { durable: true });
    await channel.assertQueue('PRODUCT_SERVICE', { durable: true });
    await channel.assertQueue('USER_RPC', { durable: true });
    await channel.bindQueue('REVIEW_SERVICE', 'CAPSTONE_EXCHANGE', 'review.*');
    await channel.bindQueue('PRODUCT_SERVICE', 'CAPSTONE_EXCHANGE', 'product.*');
    await channel.bindQueue('USER_RPC', 'CAPSTONE_EXCHANGE', 'user.*');
*/
