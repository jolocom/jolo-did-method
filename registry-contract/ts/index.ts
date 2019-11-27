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

  /**
   * Resolves a DID on the Jolocom Registry Contract. Checks if an entry for this DID exists and returns the related
   * IPFS hash if so.
   * @param did -  the DID that should be resolved
   * @returns The IPFS hash if an entry exists for the given DID
   * @throws if the DID does not have a "jolo" method string or if no entry exists
   * @example registryContract.resolveDID("did:jolo:1fb352353ff51248c5104b407f9c04c3666627fcf5a167d693c9fc84b75964e2")
   */
  async resolveDID(did: string): Promise<string> {
    const idString = stripMethodPrefix(did)
    return await this.contract.getRecord(idString)
  }

  /**
   * Updates the mapping between a DID and a IPFS hash in the registry contract on ethereum. Creates an entry if there is non.
   * @param privateKey -  the key to sign the ethereum transaction with
   * @param did - the user's DID
   * @param didDocumentHash - IPFS hash of the related DID Document
   */
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