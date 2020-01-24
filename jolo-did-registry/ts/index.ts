import RegistryContract from "jolocom-registry-contract";
import { IpfsStorageAgent } from "./ipfs";
import { IDidDocument } from "@decentralized-identity/did-common-typescript"

const JOLOCOM_PUBLIC_PROFILE_TYPE = "JolocomPublicProfile"
export const infura =  'https://rinkeby.infura.io/v3/64fa85ca0b28483ea90919a83630d5d8'
export const jolocomContract = '0xd4351c3f383d79ba378ed1875275b1e7b960f120'
export const jolocomIpfsHost = 'https://ipfs.jolocom.com:443'

export function getRegistry(providerUrl: string = infura, contractAddress: string = jolocomContract, ipfsHost: string = jolocomIpfsHost) {
  const registryContract = new RegistryContract(contractAddress, providerUrl)
  const ipfs = new IpfsStorageAgent(ipfsHost)
  return {
    commitDidDoc: async (privateKeyHex: string, didDocument: IDidDocument, publicProfile?: any): Promise<IDidDocument> => {
      let publicProfileSection, profileServiceIndex
      if (didDocument.service)
        profileServiceIndex = didDocument.service.findIndex(s => s.type === JOLOCOM_PUBLIC_PROFILE_TYPE)

      if (publicProfile) {
        const profileHash = await ipfs.storeJSON(publicProfile)
        publicProfileSection = generatePublicProfileServiceSection(didDocument.id, profileHash)
        if (!didDocument.service)
          didDocument.service = []
        if (profileServiceIndex === -1 || profileServiceIndex === undefined)
          didDocument.service.push(publicProfileSection)
        else
          didDocument.service[profileServiceIndex] = publicProfileSection
      } else {
        if (profileServiceIndex > -1)
          didDocument.service?.splice(profileServiceIndex, 1)
      }

      const documentHash = await ipfs.storeJSON(didDocument)

      await registryContract.updateDID(Buffer.from(privateKeyHex, 'hex'), didDocument.id, documentHash)
      return didDocument
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
