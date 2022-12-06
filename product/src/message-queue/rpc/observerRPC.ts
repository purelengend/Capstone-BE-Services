import { RPCPayload } from './../../types/utilType';
import { getChannel } from '../createChannel';
import { IService } from './../../service/IService';
const observerRPC = async (RPC_QUEUE_NAME: string, service: IService) => {
    const channel = await getChannel();
    await channel.assertQueue(RPC_QUEUE_NAME, { durable: false });
    channel.prefetch(1);
    channel.consume(RPC_QUEUE_NAME, async (msg) => {
        if (msg?.content) {
            const payload: RPCPayload = JSON.parse(msg.content.toString());
            const response = await service.serveRPCRequest(payload);
            channel.sendToQueue(
                msg.properties.replyTo,
                Buffer.from(JSON.stringify(response)),
                {
                    correlationId: msg.properties.correlationId
                }
            );
            channel.ack(msg);
        }
    },
        { noAck: false }
    );
}

export default observerRPC;