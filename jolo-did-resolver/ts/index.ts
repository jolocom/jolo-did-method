import { DIDDocument, ParsedDID, Resolver } from "did-resolver";
import EthereumResolver from "jolocom-registry-contract";
import { IpfsStorageAgent } from "./ipfs";

const CONTRACT_ADDRESS = '0xd4351c3f383d79ba378ed1875275b1e7b960f120';
const PROVIDER_URI = 'https://rinkeby.infura.io/';
const IPFS_ENDPOINT = 'https://ipfs.jolocom.com:443'
export const jolocomContract = new EthereumResolver(CONTRACT_ADDRESS, PROVIDER_URI)
export const jolocomIpfsAgent = new IpfsStorageAgent(IPFS_ENDPOINT)

export function getResolver(ethereumConnector = jolocomContract, ipfsAgent = jolocomIpfsAgent) {
  async function resolve(
    did: string,
    parsed: ParsedDID,
    didResolver: Resolver
  ): Promise<DIDDocument | null> {
    const ipfsHash = await ethereumConnector.resolveDID(parsed.id);

    return (await ipfsAgent.catJSON(ipfsHash)) as DIDDocument
  }

  return { "jolo": resolve }
}

export async function getPublicProfile(ipfsHash: string, ipfsAgent = jolocomIpfsAgent): Promise<object> {
  return ipfsAgent.catJSON(ipfsHash)
}