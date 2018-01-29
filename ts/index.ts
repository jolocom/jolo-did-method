const RegistryContract = require('../build/contracts/Registry.json')
const Web3 = require('web3')

export default class EthereumResolver{
  private web3: any
  private indexContract: any

  constructor(address: string, providerUri: string) {
    const provider =  new Web3.providers.HttpProvider(providerUri)
    this.web3 = new Web3(provider)

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

  updateDIDRecord(sender: string, did: string, newHash: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const keyHash = this._stripMethodPrefix(did)
      

      this.indexContract.methods.setRecord(keyHash, newHash).send({
        from: sender,
      },(error, result) => {
        if (error) {
          return reject(error)
        }

        /* The web3 provider needs to support WSS, 
         * will be configured at later stage

        this.indexContract.events.registrationSuccess((error, result) => {
          console.log(error)
          console.log(result)
        })

        */

        return resolve()
      })
    })
  }

  private _stripMethodPrefix(did: string): string {
    return did.substring(did.lastIndexOf(':') + 1)
  }
}
