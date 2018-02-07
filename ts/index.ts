import * as wallet from 'ethereumjs-wallet'
import * as Transaction from 'ethereumjs-tx'

const RegistryContract = require('../build/contracts/Registry.json')
const Web3 = require('web3')

export default class EthereumResolver{
  private web3: any
  private indexContract: any

  constructor(address: string, providerUri: string) {
    const provider =  new Web3.providers.HttpProvider(providerUri)
    this.web3 = new Web3(provider)
    this.contractAddress = address
    this.indexContract = new this.web3.eth.Contract(RegistryContract.abi, address)
  }
  
  resolveDID(did: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const keyHash = this._stripMethodPrefix(did)
      this.indexContract.methods.getRecord(keyHash).call((error, result) => {
        if (error) {
          return reject(error)
        }
        return resolve(result)
      })
    })
  }

  updateDIDRecord(ethereumKey: any, did: string, newHash: string): Promise<string> {
    const gasLimit = 100000
    const gasPrice = 20e9

    const w = wallet.fromPrivateKey(ethereumKey)
    const address = w.getAddress().toString('hex')
    const keyHash = this._stripMethodPrefix(did)
    
    const callData = this.indexContract.methods.setRecord(keyHash, newHash)
      .encodeABI()

    return this.web3.eth.getTransactionCount(address).then(nonce => {
      const tx = new Transaction({
        nonce: nonce,
        gasLimit,
        gasPrice,
        data: callData,
        to: this.contractAddress
      })

      tx.sign(ethereumKey)
      const serializedTx = tx.serialize()

      return new Promise((resolve, reject) => {
        this.web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
        .on('confirmation', () => resolve())
        .on('error', (err) => reject(err))
      })
    })
  }

  private _stripMethodPrefix(did: string): string {
    return did.substring(did.lastIndexOf(':') + 1)
  }
}
