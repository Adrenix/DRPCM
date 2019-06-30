export interface Asset {
    id: string;
    name: string;
    type: 1 | 2; // 1 = small asset; 2 = large asset
}

export interface Data {
    avatar: string;
    name: string;
    details: string;
    state: string;
    timer: boolean;
    largeAsset: Asset['id'];
    smallAsset: Asset['id'];
    largeHover: string;
    smallHover: string;
    partyState: boolean;
    partyMax: number;
    partySize: number;
}
