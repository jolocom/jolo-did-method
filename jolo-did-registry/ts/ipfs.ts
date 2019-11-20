import isNode from "detect-node";
import fetch from "node-fetch";
import FormData from "form-data";
/**
 * @class
 * Class abstracting all interactions with ipfs nodes
 * @internal
 */
export class IpfsStorageAgent {
  private readonly _endpoint: string
  public fetchImplementation = isNode ? fetch : window.fetch

  /**
   * Creates an instance of {@link IpfsStorageAgent}
   * @param host - Remote ipfs gateway address
   * @example `const ipfsAgent = new IpfsStorageAgent(https://test.com:443)`
   */

  constructor(host: string) {
    this._endpoint = host
  }

  /**
   * Get the ipfs gateway endpoint
   * @example `console.log(ipfsAgent.endpoint) // 'https://test.com'`
   */

  get endpoint() {
    return this._endpoint
  }

  /**
   * Stores a JSON document on IPFS, using a public gateway
   * @param data - JSON document to store
   * @param pin - Whether the hash should be added to the pinset
   * @returns {string} - IPFS hash
   * @example `await ipfsAgent.storeJSON({data: {test: 'test'}, pin: false})`
   */

  public async storeJSON(data: object, pin: boolean = true): Promise<string> {
    const endpoint = `${ this.endpoint }/api/v0/add?pin=${ pin }`

    const serializedData = serializeJSON(data)
    const { Hash } = await this.postRequest(endpoint, serializedData).then(
      res => res.json(),
    )
    return Hash
  }

  /**
   * Removes the specified hash from the pinset
   * @param hash - IPFS hash
   * @example `await ipfsAgent.removePinnedHash('QmZC...')`
   */

  public async removePinnedHash(hash: string): Promise<void> {
    const endpoint = `${ this.endpoint }/api/v0/pin/rm?arg=${ hash }`
    const res = await this.getRequest(endpoint)

    if (!res.ok) {
      throw new Error(
        `Removing pinned hash ${ hash } failed, status code: ${ res.status }`,
      )
    }
  }

  /**
   * Helper method to post data using correct fetch implementation
   * @param endpoint - HTTP endpoint to post data to
   * @param data - JSON document to post
   */

  private async postRequest(endpoint: string, data: any) {
    return this.fetchImplementation(endpoint, {
      method: 'POST',
      body: data,
    })
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
 * Helper method to serialize JSON so it can be parsed by the go-ipfs implementation
 * @param data - JSON document to be serialized
 */

export function serializeJSON(data: object) {
  if (!data || typeof data !== 'object') {
    throw new Error(`JSON expected, received ${ typeof data }`)
  }

  const formData = new FormData()
  if (isNode) {
    formData.append('file', Buffer.from(JSON.stringify(data)))
    return formData
  } else {
    const serializedData = Buffer.from(JSON.stringify(data)).toString(
      'binary',
    )
    const dataBlob = new Blob([serializedData], {})

    formData.append('file', dataBlob)
    return formData
  }
}

/**
 * Returns a configured instance of the Jolocom ipfs agent
 * @return - Instantiated IPFS agent
 */

export const jolocomIpfsStorageAgent = new IpfsStorageAgent('https://ipfs.jolocom.com:443')