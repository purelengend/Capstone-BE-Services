import { getChannel } from './createChannel';
import { v4 as uuidv4 } from 'uuid';

export const requestRPC = async (
    RPC_QUEUE_NAME: string,
    requestPayload: Object
) => {
    const uuid = uuidv4();
    return await requestData(RPC_QUEUE_NAME, requestPayload, uuid);
};

const requestData = async (
    RPC_QUEUE_NAME: string,
    requestPayload: Object,
    uuid: string
) => {
    try {
        const channel = await getChannel();

        const q = await channel.assertQueue('', { exclusive: true });

        channel.sendToQueue(
            RPC_QUEUE_NAME,
            Buffer.from(JSON.stringify(requestPayload)),
            {
                correlationId: uuid,
                replyTo: q.queue,
            }
        );

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                channel.close();
                resolve('timeout and API could not fulfill the request');
            }, 5000);
            channel.consume(
                q.queue,
                (msg) => {
                    if (
                        msg?.content &&
                        msg?.properties?.correlationId === uuid
                    ) {
                        const response = JSON.parse(msg.content.toString());
                        resolve(response);
                        clearTimeout(timeout);
                    } else {
                        reject(
                            'Error in consuming message, message content is null or correlationId is not matching'
                        );
                    }
                },
                { noAck: true }
            );
        });
    } catch (error) {
        console.log('Error in requestRPCMessage', error);
        throw error;
    }
};
