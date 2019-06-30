export namespace Util {
    export function sleep(time: number): Promise<void> {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }

    export function getBinarySize(arg: string): number {
        return Buffer.byteLength(arg, 'utf8');
    }
}
