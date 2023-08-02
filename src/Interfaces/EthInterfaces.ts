export interface RequestArguments {
    method: string;
    params?: unknown[] | object;
}

export interface EthereumInterface {
    isConnected: () => boolean;
    isMetaMask: boolean;
    chainId: string;
    request: (args: RequestArguments) => Promise<unknown>;
    selectedAddress: string;
}