import { Contract, ethers } from "ethers";
import { BaseProvider } from "ethers/providers";

const contractABI = require('../build/contracts/Registry.json')

export default class RegistryContract {
  private readonly provider: BaseProvider
  private contract: Contract

  constructor(address: string, providerUri: string) {
    this.provider = new ethers.providers.JsonRpcProvider(providerUri)
    this.contract = new ethers.Contract(address, contractABI.abi, this.provider)
  }

  async resolveDID(did: string): Promise<string> {
    const idString = stripMethodPrefix(did)
    return await this.contract.getRecord(idString)
  }

  async updateDID(privateKey: Buffer, did: string, didDocumentHash: string): Promise<void> {
    const idString = stripMethodPrefix(did)

    const wallet = new ethers.Wallet(privateKey, this.provider)
    const signer = this.contract.connect(wallet)
    const tx = await signer.setRecord(idString, didDocumentHash)
    await tx.wait()
  }
}

function stripMethodPrefix(did: string) {
  if (did.indexOf('jolo') === -1)
    throw 'Only "jolo" DIDs are allowed'
  return `0x${ did.substring(did.lastIndexOf(':') + 1) }`
}