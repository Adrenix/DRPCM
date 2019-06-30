/// <reference types="node" />

declare module 'discord-rich-presence' {
    import { EventEmitter } from 'events';
    import { Client as RPCClient, ActivityArgs as Args, ActivityResponse as Response, RPCUser } from 'discord-rpc';

    namespace makeClient {
        export interface RichPresence {
            transport: any;
            on(event: 'connected', listener: (response: makeClient.RichPresence) => void): this;
            on(event: 'activity', listener: (response: Response) => void): this;
            on(event: 'error', listener: (error: Error) => void): this;

            once(event: 'connected', listener: (response: makeClient.RichPresence) => void): this;
            once(event: 'activity', listener: (response: Response) => void): this;
            once(event: 'error', listener: (error: Error) => void): this;
        }

        export class RichPresence extends EventEmitter {
            public rpc: RPCClient;
            public updatePresence(args: Args): void;
            public clearPresence(): void;
            public disconnect(): void;
        }

        export type ActivityArgs = Args;
        export type ActivityResponse = Response;
        export type User = RPCUser;
        export type Client = RPCClient;
    }

    function makeClient(clientId: string): makeClient.RichPresence;

    export = makeClient;
}
