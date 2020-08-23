import { Signature } from "ethers"
import RegistryContract from "jolocom-registry-contract";
import { IpfsStorageAgent } from "./ipfs";
import { IDidDocument } from "@decentralized-identity/did-common-typescript"

const JOLOCOM_PUBLIC_PROFILE_TYPE = "JolocomPublicProfile"
export const infura =  'https://rinkeby.infura.io/v3/64fa85ca0b28483ea90919a83630d5d8'
export const jolocomContract = '0xd4351c3f383d79ba378ed1875275b1e7b960f120'
export const jolocomIpfsHost = 'https://ipfs.jolocom.com:443'

export function getRegistrar(providerUrl: string = infura, contractAddress: string = jolocomContract, ipfsHost: string = jolocomIpfsHost) {
  const registryContract = new RegistryContract(contractAddress, providerUrl)
  const ipfs = new IpfsStorageAgent(ipfsHost)

  return {
    // TODO Nonce or public key
    publishDidDocument: async (pubKey: Buffer, didDocument: IDidDocument): Promise<string> => {
      const documentHash = await ipfs.storeJSON(didDocument)

      return registryContract.prepareAnchoringTransaction(didDocument.id, documentHash, pubKey)
        .then(txBuffer => '0x' + txBuffer.toString('hex'))
    },

    broadcastTransaction: async (transactionHex: string, signature: Signature) => {
      return registryContract.broadcastTransaction(transactionHex, signature)
    },

    publishPublicProfile: async (did: string, publicProfile: any): Promise<ReturnType<typeof generatePublicProfileServiceSection>> => {
      return generatePublicProfileServiceSection(did, await ipfs.storeJSON(publicProfile))
    }
  }
}


/**
 * Instantiates the {@link ServiceEndpointsSection} class based on passed arguments
 * @param did - The did of the did document owner
 * @param profileIpfsHash - IPFS hash that can be used to dereference the public profile credential
 * @internal
 */

function generatePublicProfileServiceSection(
  did: string,
  profileIpfsHash: string,
) {
  return {
    id: `${ did };jolocomPubProfile`,
    serviceEndpoint: `ipfs://${ profileIpfsHash }`,
    description: 'Verifiable Credential describing entity profile',
    type: JOLOCOM_PUBLIC_PROFILE_TYPE,
  }
}
