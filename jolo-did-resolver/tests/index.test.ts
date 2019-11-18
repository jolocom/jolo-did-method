import { getResolver } from "../ts";
import { Resolver } from "did-resolver"
import { testDid, testDidDoc } from "../ts/test.data";

describe('DID Resolver', () => {
  // TODO setup test network & test ipfs
  it('should resolve jolo DID', async () => {
    const joloResolver = getResolver()
    const resolver = new Resolver(joloResolver)
    const didDoc = await resolver.resolve(testDid)
    expect(didDoc).toEqual(testDidDoc);
  });

  it('should fail if did id string is wrong', async () => {
    const joloResolver = getResolver()
    const resolver = new Resolver(joloResolver)

    await expect(resolver.resolve('did:jolo:notHex')).rejects.toThrow()
  });
})
