const fetchNode = require('node-fetch')
const isNode = require('detect-node')

/**
 * @class
 * Class abstracting all interactions with ipfs nodes
 * @internal
 */
export class IpfsStorageAgent {
  private readonly _endpoint: string
  public fetchImplementation = isNode ? fetchNode : window.fetch

  /**
   * Creates an instance of {@link IpfsStorageAgent}
   * @param host - Remote ipfs gateway url
   * @example `const ipfsAgent = new IpfsStorageAgent('https://test.com:443')`
   */

  constructor(host: string) {
    this._endpoint = host
  }

  /**
   * Dereferences an IPFS hash and parses the result as json
   * @param hash - IPFS hash
   * @example `console.log(await ipfsAgent.catJSON('QmZC...')) // {test: 'test'}`
   */

  public async catJSON(hash: string): Promise<object> {
    const endpoint = `${ this._endpoint }/api/v0/cat/${ hash }`
    const res = await this.getRequest(endpoint)
    return res.json()
  }

  /**
   * Helper method to get data using correct fetch implementation
   * @param endpoint - HTTP endpoint to get data from
   */

  private async getRequest(endpoint: string) {
    return this.fetchImplementation(endpoint)
  }
}
/**
 * Returns a configured instance of the Jolocom ipfs agent
 * @return - Instantiated IPFS agent
 */

export const jolocomIpfsStorageAgent = new IpfsStorageAgent('https://ipfs.jolocom.com:443')