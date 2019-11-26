import { DIDDocument, ParsedDID, Resolver } from "did-resolver";
import EthereumResolver from "jolocom-registry-contract";
import { IpfsStorageAgent } from "./ipfs";

const CONTRACT_ADDRESS = '0xd4351c3f383d79ba378ed1875275b1e7b960f120';
const PROVIDER_URI = 'https://rinkeby.infura.io/';
const IPFS_ENDPOINT = 'https://ipfs.jolocom.com:443'

export function getResolver(providerUri: string = PROVIDER_URI, contractAddress: string = CONTRACT_ADDRESS, ipfsHost: string = IPFS_ENDPOINT) {
  const ethereumConnector = new EthereumResolver(contractAddress, providerUri)
  const ipfsAgent = new IpfsStorageAgent(ipfsHost)

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

export async function getPublicProfile(ipfsHash: string, ipfsHost: string): Promise<any> {
  const ipfsAgent = new  IpfsStorageAgent(ipfsHost)
  return ipfsAgent.catJSON(ipfsHash)
}