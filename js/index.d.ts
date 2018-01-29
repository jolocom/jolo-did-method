export default class EthereumResolver {
    private web3;
    private indexContract;
    constructor(address: string, providerUri: string);
    resolveDID(did: string): Promise<string>;
    updateDIDRecord(sender: string, did: string, newHash: string): Promise<string>;
    private _stripMethodPrefix(did);
}
