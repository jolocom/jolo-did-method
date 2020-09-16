import { DIDDocument, ParsedDID, Resolver } from "did-resolver";
import RegistryContract from "@jolocom/registry-contract";
import { IpfsStorageAgent } from "./ipfs";

const CONTRACT_ADDRESS = '0xd4351c3f383d79ba378ed1875275b1e7b960f120';
const PROVIDER_URI = 'https://rinkeby.infura.io/v3/64fa85ca0b28483ea90919a83630d5d8';
const IPFS_ENDPOINT = 'https://ipfs.jolocom.com:443'

/**
 * Returns a configured resolver for the did:jolo method
 * @param providerUri - Ethereum HTTP gateway used for reading the registry contract state and broadcasting transactions
 * @param contractAddress - The Ethereum address of a instance of the registry smart contract to use for anchoring / resolution
 * @param ipfsHost - IPFS gateway HTTPS API endpoint used for storing / reading IPFS documents
 */

export function getResolver(providerUri: string = PROVIDER_URI, contractAddress: string = CONTRACT_ADDRESS, ipfsHost: string = IPFS_ENDPOINT) {
  const registryContract = new RegistryContract(contractAddress, providerUri)
  const ipfsAgent = new IpfsStorageAgent(ipfsHost)

  /**
   * Given a `jolo` DID, will attempt to fetch the corresponding DID Document according to the (`did:jolo` method specification).
   * @param did - the did to resolve
   * @param parsed - a object containing the parsed DID, as provided by the "did-resolver" module
   * @param didResolver - instance of {@link Resolver}, populated by the "did-resolver" module
   * @returns DID Document - Did Document for the corresponding DID in JSON form
   */

  async function resolve(
    did: string,
    parsed: ParsedDID,
    didResolver: Resolver
  ): Promise<DIDDocument | null> {
    const ipfsHash = await registryContract.resolveDID(did);

    if (ipfsHash) {
      return (await ipfsAgent.catJSON(ipfsHash)) as DIDDocument;
    }

    return null
  }

  return { "jolo": resolve }
}

/**
 * Given a Did Document for a `jolo` identity and a link to an IPFS HTTP gateway, the function will attempt
 * to fetch the Public Profile listed in the `ServiceEndpoint` section if one is present.
 * @see https://jolocom-lib.readthedocs.io/en/latest/publicProfile.html
 *
 * @param didDoc - JSON Did Document potentially containing a Jolocom public profile serviceEndpoint section
 * @param ipfsHost - A public IPFS gateway which can be used to retrieve the public profile signed credential
 * @returns SignedCredential - A public profile signed credential encoding some general info about the identity
 * if one is present in the Did Document
 */

export async function getPublicProfile(didDoc: DIDDocument, ipfsHost: string = IPFS_ENDPOINT): Promise<any | null> {
  const ipfsAgent = new IpfsStorageAgent(ipfsHost);

  const publicProfileSection = didDoc?.service?.find(
    endpoint => endpoint.type === 'JolocomPublicProfile',
  );

  if (publicProfileSection?.serviceEndpoint) {
    const hash = publicProfileSection.serviceEndpoint.replace('ipfs://', '');
    return ipfsAgent.catJSON(hash)
  }
}

