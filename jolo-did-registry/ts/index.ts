import EthereumResolver from "jolocom-registry-contract/js";
import { IpfsStorageAgent } from "./ipfs";
import { IDidDocument } from "@decentralized-identity/did-common-typescript"

const JOLOCOM_PUBLIC_PROFILE_TYPE = "JolocomPublicProfile"

export function getRegistry(providerUrl: string, contractAddress: string, ipfsHost: string) {
  const registryContract = new EthereumResolver(contractAddress, providerUrl)
  const ipfs = new IpfsStorageAgent(ipfsHost)
  return {
    commitDidDoc: async (privateKey: string, didDocument: IDidDocument, publicProfile?: any): Promise<IDidDocument> => {
      let publicProfileSection
      if (publicProfile) {
        const profileHash = await ipfs.storeJSON(publicProfile)
        publicProfileSection = generatePublicProfileServiceSection(didDocument.id, profileHash)
      }

      if (!didDocument.service)
        didDocument.service = []
      const profileServiceIndex = didDocument.service.findIndex(s => s.type === JOLOCOM_PUBLIC_PROFILE_TYPE)
      if (profileServiceIndex === -1)
        didDocument.service.push(publicProfileSection)
      else
        didDocument.service[profileServiceIndex] = publicProfileSection

      const documentHash = await ipfs.storeJSON(didDocument)

      await registryContract.updateDIDRecord(privateKey, didDocument.id, documentHash)
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