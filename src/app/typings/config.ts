import { Asset } from '../providers/rpc.interface';

export interface Config {
    clientId: string;
    assets: Array<Asset>;
    details: string;
    state: string;
    largeAsset: string;
    largeHover: string;
    smallAsset: string;
    smallHover: string;
    timer: boolean;
    partyState: boolean;
    partyMax: number;
    partySize: number;
    doTutorial: boolean;
}
