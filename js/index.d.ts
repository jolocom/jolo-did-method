export default class EthereumResolver {
    private web3;
    private indexContract;
    private contractAddress;
    constructor(address: string, providerUri: string);
    resolveDID(did: string): Promise<string>;
    updateDIDRecord(ethereumKey: any, did: string, newHash: string): Promise<string>;
    private _stripMethodPrefix(did);
}
