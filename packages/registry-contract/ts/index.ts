import { Contract, ethers, UnsignedTransaction, utils } from "ethers";
import { keccak256 } from "ethers/lib/utils";
import { BaseProvider } from "@ethersproject/providers";

const contractABI = require('../build/contracts/Registry.json')

export type SignatureLike = {
  r: string;
  s: string;
  recoveryParam?: number;
}

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
  async broadcastTransaction(tx: string, sig: SignatureLike) {
    if (sig.r.length !== 66) {
      throw new Error(`Invalid R length, expected 32 bytes, got ${sig.r.length}`)
    }

    if (sig.s.length !== 66) {
      throw new Error(`Invalid S length, expected 32 bytes, got ${sig.s.length}`)
    }

    if (sig.recoveryParam !== 0 && sig.recoveryParam !== 1) {
      throw new Error(`Invalid recovery param, expected 0 or 1, got ${sig.recoveryParam}`)
    }

    return this.provider.sendTransaction(
      utils.serializeTransaction(utils.parseTransaction(tx), sig)
    )
  }

  /**
    * Returns an unsigned, RLP encoded, serialized, Etereum TX.
    * The returned TX can be signed, re-encoded (including the V, R, S signature parts)
    * and broadcast to the Ethereum
    */

  async prepareAnchoringTransaction(
    did: string,
    hash: string,
    pubKey: Buffer,
     { gasPrice, gasLimit } = {
      gasPrice: '0x4e3b29200',
      gasLimit: '0x493e0'
    }): Promise<Buffer> {

    const idString = stripMethodPrefix(did)
    const nonce = await this.provider.getTransactionCount(
      ethers.utils.computeAddress(pubKey)
    )

    return this.contract.populateTransaction.setRecord(
      idString,
      hash,
      {
        nonce,
        gasLimit,
        gasPrice,
        value: '0x00',
      }
    ).then(tx => Buffer.from(utils.serializeTransaction(tx).slice(2), 'hex'))
  }

  /**
   * Given a raw unsigned ethereum TX, and a signature object (including R, S, and the recovery value),
   * will encode the signature correctly and use 'this.provider' to send the TX to the network.
   */

  async sendRawTransaction(txData: string | {
    unsignedTx: UnsignedTransaction,
    signature: SignatureLike
  }) {
    if (typeof txData === 'string') {
      return this.provider.sendTransaction(txData)
    }

    const tx = this.provider.sendTransaction(
      utils.serializeTransaction(txData.unsignedTx, txData.signature)
    )

    return tx.then(res => res.wait())
  }
}

function stripMethodPrefix(did: string) {
  if (did.indexOf('jolo') === -1)
    throw 'Only "jolo" DIDs are allowed'
  return `0x${ did.substring(did.lastIndexOf(':') + 1) }`
}

