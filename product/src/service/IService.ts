import { RPCPayload } from '../types/utilTypes';
export interface IService {
    subscribeEvents(payload: string): void;
    serveRPCRequest(payload: RPCPayload): any;
}