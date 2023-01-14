import { EventPayload, RPCPayload } from '../types/utilTypes';
export interface IService {
    subscribeEvents(payload: EventPayload): void;
    serveRPCRequest(payload: RPCPayload): any;
}