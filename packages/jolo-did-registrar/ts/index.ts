import RegistryContract, { SignatureLike } from "@jolocom/registry-contract";
import { IpfsStorageAgent } from "./ipfs";
import { IDidDocument } from "@decentralized-identity/did-common-typescript"

const JOLOCOM_PUBLIC_PROFILE_TYPE = "JolocomPublicProfile"
export const infura =  'https://rinkeby.infura.io/v3/64fa85ca0b28483ea90919a83630d5d8'
export const jolocomContract = '0xd4351c3f383d79ba378ed1875275b1e7b960f120'
export const jolocomIpfsHost = 'https://ipfs.jolocom.com:443'

/**
 * Returns a configured registrar for the did:jolo method
 * @param providerUri - Ethereum HTTP gateway used for reading the smart contract state and broadcasting transactions
 * @param contractAddress - Ethereum address of a instance of the registry smart contract, to be used for anchoring / resolution
 * @param ipfsHost - IPFS gateway HTTPS API endpoint used for storing / reading IPFS documents, should allow for pinning
 */

export function getRegistrar(providerUrl: string = infura, contractAddress: string = jolocomContract, ipfsHost: string = jolocomIpfsHost) {
  const registryContract = new RegistryContract(contractAddress, providerUrl)
  const ipfs = new IpfsStorageAgent(ipfsHost)

  return {

    /**
     * Returns an unsigned, RLP encoded, serialized, Etereum TX.
     * Once the transaction is signed, it can be broadcasted to the network to be
     * processed by the registry smart contract.
     *
     * @param pubKey - the public key of the future transaction signer. This is required
     * to fetch the latest corresponding Ethereum transaction nonce, and assemble a valid transaction
     * @param didDocument - the Did Document to store on IPFS
     * @returns Unsigned, hex encoded, RLP encoded contract call. Can be signed using a secp256k1 key.
     */

    publishDidDocument: async (pubKey: Buffer, didDocument: IDidDocument): Promise<string> => {
      const documentHash = await ipfs.storeJSON(didDocument)

      return registryContract.prepareAnchoringTransaction(didDocument.id, documentHash, pubKey)
        .then(txBuffer => '0x' + txBuffer.toString('hex'))
    },

    /**
     * Given an unsigned, hex encoded Ethereum transaction (e.g. as created by `publishDidDocument`)
     * and a {@link SignatureLike} object (containing the R, S, and V values for the corresponding signature), will 
     * assemble / encode the signed transaction and broadcast it to the Ethereum network,
     * then wait for the transaction to be mined, and return the result.
     * @see https://docs.ethers.io/v5/api/utils/bytes/#utils-splitSignature
     *
     * @param transactionHex - RLP encoded Ethereum transaction (e.g. as created by `publishDidDocument`)
     * @param signature - Object containing the hex encoded values for R and S, and a 0 / 1 value vor V. 
     * @returns TransactionReceipt containing the status of the TX, gas used, # of confirmations, etc.
     */

    broadcastTransaction: async (transactionHex: string, signature: SignatureLike) => {
      return registryContract.broadcastTransaction(transactionHex, signature)
    },

    /**
     * Given a DID and a "Public Profile" JSON object, the function will attemtp to publish the Public Profile document
     * to IPFS, and return a "ServiceEndpoint" section with the corresponding IPFS hash included
     * @see https://jolocom-lib.readthedocs.io/en/latest/publicProfile.html
     *
     * @param did - The DID of the identity associated with the public profile
     * @param publicProfile - Document to be published to IPFS and linked in the Did Document
     *   in the Jolocom stack, the public profile is expected to be a JSON Signed Verifiable Credential
     *
     * @returns Service Endpoint section in JSON form, advertising the newly published document
     * The returned section can be included in a DID Document to make the public profile discoverable.
     */

    publishPublicProfile: async (did: string, publicProfile: any): Promise<ReturnType<typeof generatePublicProfileServiceSection>> => {
      return generatePublicProfileServiceSection(did, await ipfs.storeJSON(publicProfile))
    }
  }
}


/**
 * @internal
 * Helper function to generate a Service Endpoint entry advertising a Public Profile
 * given an IPFS hash and the DID of the owner / associated identity.
 * The returned section can be added to a DID Document to advertise
 *
 * @param did - The DID of the identity associated with the public profile
 * @param profileIpfsHash - The IPFS hash to be listed
 *   in the Jolocom stack, the public profile is expected to be a JSON Signed Verifiable Credential
 *
 * @returns Service Endpoint section in JSON form, advertising the newly published document
 * The returned section can be included in a DID Document to make the public profile discoverable.
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
