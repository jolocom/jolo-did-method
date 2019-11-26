import { getPublicProfile, getResolver } from "../ts";
import { Resolver } from "did-resolver"
import { testDid, testDidDoc } from "./test.data";
import RegistryContract from "jolocom-registry-contract";
import { IpfsStorageAgent } from "../ts/ipfs";

describe('DID Resolver', () => {
  let ethereumMock
  beforeAll(() => {
    ethereumMock = jest.spyOn(RegistryContract.prototype, 'resolveDID').mockResolvedValue('testHash')
    jest.spyOn(IpfsStorageAgent.prototype, 'catJSON').mockResolvedValue(testDidDoc)
  })

  it('should resolve jolo DID', async () => {
    const joloResolver = getResolver('etherumConnector', '0xD4351c3f383d79bA378ed1875275b1E7b960f120', 'http:test:8000')
    const resolver = new Resolver(joloResolver)
    const didDoc = await resolver.resolve(testDid)
    expect(IpfsStorageAgent.prototype.catJSON).toBeCalledWith('testHash')
    expect(didDoc).toEqual(testDidDoc);
  });

  it('should fail if did id string is wrong', async () => {
    // disable mock in this test
    ethereumMock.mockRestore()

    const joloResolver = getResolver()
    const resolver = new Resolver(joloResolver)

    await expect(resolver.resolve('did:jolo:notHex')).rejects.toThrow()
  });

  it('should test public profile resolver', async () => {
    await getPublicProfile('test', 'test')
    expect(IpfsStorageAgent.prototype.catJSON).toBeCalledWith('test')
  });
})
