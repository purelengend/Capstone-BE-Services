import { RPCPayload } from '../../types/utilTypes';
import { getChannel } from '../createChannel';
import { IService } from '../../service/IService';
const observerRPC = async (RPC_QUEUE_NAME: string, service: IService) => {
    const channel = await getChannel();
    await channel.assertQueue(RPC_QUEUE_NAME, { durable: false });
    console.log(`[x] Awaiting RPC requests on ${RPC_QUEUE_NAME}`);
    channel.prefetch(1);
    channel.consume(RPC_QUEUE_NAME, async (msg) => {
        if (msg?.content) {
            const payload: RPCPayload = JSON.parse(msg.content.toString());
            console.log(`[.] payload received ${payload}`);
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