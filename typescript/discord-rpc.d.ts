/// <reference types="node" />

declare module 'discord-rpc' {
    import { EventEmitter } from 'events';

    interface Asset {
        id: string;
        name: string;
        type: 1 | 2; // 1 = small asset; 2 = large asset
    }

    interface User {
        id: string;
        username: string;
        discriminator: string;
        avatar: string;
        bot: boolean;
        flags: number;
        premium_type: number;
    }

    /**
     * RPC Activity Arguments
     */

    interface RPCActivityArgs {
        state: string; // max 128 bytes
        details: string; // max 128 bytes
        startTimestamp: number;
        endTimestamp: number;
        largeImageKey: string; // max 32 bytes
        largeImageText: string; // max 128 bytes
        smallImageKey: string; // max 32 bytes
        smallImageText: string; // max 128 bytes
        partySize: number;
        partyMax: number;
    }

    /**
     * RPC Activity Response
     */

    interface RPCActivityResponse {
        name: string;
        application_id: string;
        state: string;
        details: string;
        timestamps: Partial<{ start: number; end: number }>;
        party: Partial<{ size: Array<number> }>;
        assets: Partial<{
            large_image: string;
            large_text: string;
            small_image: string;
            small_text: string;
        }>;
    }

    interface Options {
        transport: 'ipc' | 'websocket';
    }

    class RPCClient extends EventEmitter {
        public accessToken: string | undefined;
        public clientId: string | undefined;
        public application: undefined;
        public user: undefined | User;
        public options: Options;

        constructor(options: Options);

        /**
         * Search and connect to RPC
         */
        public connect(clientId: string): Promise<RPCClient>;

        /**
         * Set RPC Activity
         */
        public setActivity(args: Partial<RPCActivityArgs>, pid?: number): Promise<Partial<RPCActivityResponse>>;

        /**
         * Clear RPC Activity
         */
        public clearActivity(pid?: number): Promise<void>;

        /**
         * Destroy RPC Client
         */
        public destroy(): Promise<void>;
    }

    /**
     * Module Exports
     */

    namespace RPC {
        /* RPC JS Exports */
        class Client extends RPCClient {
            transport: any;
        }

        const register: (id: string) => unknown;

        /* RPC Types */
        type ActivityArgs = Partial<RPCActivityArgs>;
        type ActivityResponse = Partial<RPCActivityResponse>;
        type ActivityAsset = Asset;
        type RPCUser = User;
    }

    export = RPC;
}
