import { Contract, ethers } from "ethers";
import { BaseProvider } from "ethers/providers";

const RegistryContract = require('../build/contracts/Registry.json')

export default class EthereumConnector {
  private readonly provider: BaseProvider
  private contract: Contract

  constructor(address: string, providerUri: string) {
    this.provider = new ethers.providers.JsonRpcProvider(providerUri)
    this.contract = new ethers.Contract(address, RegistryContract.abi, this.provider)
  }

  async resolveDID(did: string): Promise<string> {
    const keyHash = stripMethodPrefix(did)
    return await this.contract.getRecord(keyHash)
  }

  async updateDIDRecord(ethereumKey: any, did: string, newHash: string): Promise<void> {
    const keyHash = stripMethodPrefix(did)

    const wallet = new ethers.Wallet(ethereumKey, this.provider)
    const signer = this.contract.connect(wallet)
    const tx = await signer.setRecord(keyHash, newHash)
    await tx.wait()
  }
}

function stripMethodPrefix(did: string) {
  return `0x${ did.substring(did.lastIndexOf(':') + 1) }`
}