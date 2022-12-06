import { RPCPayload } from './../types/utilType';
export interface IService {
    subscribeEvents(payload: string): void;
    serveRPCRequest(payload: RPCPayload): any;
}