import { v4 as uuidv4 } from 'uuid';
import { getChannel } from '../createChannel';

export const requestRPC = async (
    RPC_QUEUE_NAME: string,
    requestPayload: Object
) => {
    const uuid = uuidv4();
    return await requestData(RPC_QUEUE_NAME, requestPayload, uuid);
}

const requestData = async (RPC_QUEUE_NAME: string, requestPayload: Object, uuid: string) => {
    try {
        const channel = await getChannel();
        const responseQueue = await channel.assertQueue('', { exclusive: true });

        channel.sendToQueue(
            RPC_QUEUE_NAME,
            Buffer.from(JSON.stringify(requestPayload)),
            {
                correlationId: uuid,
                replyTo: responseQueue.queue
            }
        );

        return new Promise((resolve, reject) => {
            const timeOut = setTimeout(() => {
                channel.close();
                reject('timeout and API could not fulfill the request');
            }, 5000);
            channel.consume(
                responseQueue.queue,
                (msg) => {
                    if (msg?.content &&
                        msg?.properties?.correlationId === uuid) {
                        const response = JSON.parse(msg.content.toString());
                        resolve(response);
                        clearTimeout(timeOut);
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
        console.log('Error in requestRPC', error);
        throw error;
    }
}