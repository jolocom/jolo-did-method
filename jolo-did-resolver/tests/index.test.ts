import { getPublicProfile, getResolver } from "../ts";
import { Resolver } from "did-resolver"
import { testDid, testDidDoc } from "../ts/test.data";
import EthereumResolver from "jolocom-registry-contract";
import { IpfsStorageAgent } from "../ts/ipfs";

describe('DID Resolver', () => {
  let etherumConnector, ipfsAgent

  beforeAll(() => {
    // mock ethereum connector & ipfs agent
    etherumConnector = new EthereumResolver('address', 'rpc-host')
    etherumConnector.resolveDID = jest.fn().mockResolvedValue('testHash')
    ipfsAgent = new IpfsStorageAgent('http://127.0.0.1:5001')
    // ipfsAgent.catJSON = jest.fn().mockResolvedValue(testDidDoc)
  })

  it('should resolve jolo DID', async () => {
    const joloResolver = getResolver(etherumConnector, ipfsAgent)
    const resolver = new Resolver(joloResolver)
    const didDoc = await resolver.resolve(testDid)
    // expect(ipfsAgent.catJSON).toBeCalledWith('QmRdmodnKFxmkSQnkWY35cdmSJtbhhJBADMwnCCauYBDv6')
    expect(didDoc).toEqual(testDidDoc);
  });

  it('should fail if did id string is wrong', async () => {
    const joloResolver = getResolver()
    const resolver = new Resolver(joloResolver)

    await expect(resolver.resolve('did:jolo:notHex')).rejects.toThrow()
  });

  it('should test public profile resolver', async () => {
    const resilt = await getPublicProfile('QmRdmodnKFxmkSQnkWY35cdmSJtbhhJBADMwnCCauYBDv6', ipfsAgent)
    console.log(resilt)
    expect(ipfsAgent.catJSON).toBeCalledWith('test')
  });
})
