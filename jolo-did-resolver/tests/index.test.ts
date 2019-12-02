import { getPublicProfile, getResolver } from "../ts";
import { Resolver } from "did-resolver";
import { testDid, testDidDoc, testDidDocWithPublicProfile } from "./test.data";
import EthereumResolver from "jolocom-registry-contract";
import { IpfsStorageAgent } from "../ts/ipfs";

describe("DID Resolver", () => {
  let ethereumMock;
  beforeAll(() => {
    ethereumMock = jest
      .spyOn(EthereumResolver.prototype, "resolveDID")
      .mockResolvedValue("testHash");
    jest
      .spyOn(IpfsStorageAgent.prototype, "catJSON")
      .mockResolvedValue(testDidDoc);
  });
  describe("getResolver", () => {
    it("should resolve jolo DID", async () => {
      const joloResolver = getResolver(
        "etherumConnector",
        "0xD4351c3f383d79bA378ed1875275b1E7b960f120",
        "http:test:8000"
      );
      const resolver = new Resolver(joloResolver);
      const didDoc = await resolver.resolve(testDid);
      expect(IpfsStorageAgent.prototype.catJSON).toBeCalledWith("testHash");
      expect(didDoc).toEqual(testDidDoc);
    });

    it("should fail if did id string is wrong", async () => {
      // disable mock in this test
      ethereumMock.mockRestore();

      const joloResolver = getResolver();
      const resolver = new Resolver(joloResolver);

      await expect(resolver.resolve("did:jolo:notHex")).rejects.toThrow();
    });
  });

  describe("getPublicProfile", () => {
    it("should test public profile resolver", async () => {
      const publicProfile = await getPublicProfile(testDidDocWithPublicProfile);
      expect(IpfsStorageAgent.prototype.catJSON).toBeCalledWith("testHash");
      // public profile should be mocked return value of catJson see line #11
      expect(publicProfile).toEqual(testDidDoc);
    });

    it("should return null if no public profile is in DID Document", async () => {
      // @ts-ignore
      const publicProfile = await getPublicProfile(testDidDoc);
      expect(IpfsStorageAgent.prototype.catJSON).toBeCalledTimes(0);
      expect(publicProfile).toBe(undefined);
    });
  });
});
