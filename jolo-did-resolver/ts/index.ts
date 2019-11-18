import { DIDDocument, ParsedDID, Resolver } from "did-resolver";
import EthereumResolver from "jolocom-registry-contract";
import { IpfsStorageAgent } from "./ipfs";

const CONTRACT_ADDRESS = '0xd4351c3f383d79ba378ed1875275b1e7b960f120';
const PROVIDER_URI = 'https://rinkeby.infura.io/';
const IPFS_ENDPOINT = 'https://ipfs.jolocom.com:443'

export function getResolver(contractAddress = CONTRACT_ADDRESS, providerUri = PROVIDER_URI, ipfsEndpoint = IPFS_ENDPOINT) {
  const ethereumContract = new EthereumResolver(contractAddress, providerUri);
  const ipfs = new IpfsStorageAgent(ipfsEndpoint)

  async function resolve(
    did: string,
    parsed: ParsedDID,
    didResolver: Resolver
  ): Promise<DIDDocument | null> {
    const ipfsHash = await ethereumContract.resolveDID(parsed.id);

    return (await ipfs.catJSON(ipfsHash)) as DIDDocument
  }

  return { "jolo": resolve }
}

export async function getPublicProfile(ipfsHash: string, ipfsEndpoint = IPFS_ENDPOINT): Promise<object> {
  const ipfs = new IpfsStorageAgent(ipfsEndpoint)
  return ipfs.catJSON(ipfsHash)
}