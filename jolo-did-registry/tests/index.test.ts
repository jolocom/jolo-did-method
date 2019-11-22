import { getRegistry } from "../ts";
import EthereumResolver from "jolocom-registry-contract";
import { IpfsStorageAgent } from "../ts/ipfs";
import {
  testDidDoc,
  testDidDocHash,
  testDidDocWithPublicProfile,
  testPrivateKey,
  testPublicProfile
} from "./test.data";

describe("DID Registry", () => {
  let contractMock, ipfsMock;
  let registry: ReturnType<typeof getRegistry>;
  beforeAll(() => {
    contractMock = jest
      .spyOn(EthereumResolver.prototype, "updateDIDRecord")
      .mockResolvedValue("");
    ipfsMock = jest
      .spyOn(IpfsStorageAgent.prototype, "storeJSON")
      .mockResolvedValue(testDidDocHash);

    registry = getRegistry();
  });

  it("should store DID Doc in registry", async () => {
    const didDoc = await registry.commitDidDoc(testPrivateKey, testDidDoc);
    expect(contractMock.mock.calls[0][2]).toEqual(testDidDocHash);
    expect(didDoc).toMatchInlineSnapshot(`
      Object {
        "@context": "https://w3id.org/did/v1",
        "id": "did:jolo:test",
      }
    `);
  });

  it("should add public profile to DID doc", async () => {
    const didDoc = await registry.commitDidDoc(
      testPrivateKey,
      testDidDoc,
      testPublicProfile
    );
    expect(ipfsMock.mock.calls[0][0]).toEqual(testPublicProfile);
    expect(ipfsMock).toBeCalledTimes(2);
    expect(didDoc).toMatchInlineSnapshot(`
      Object {
        "@context": "https://w3id.org/did/v1",
        "id": "did:jolo:test",
        "service": Array [
          Object {
            "description": "Verifiable Credential describing entity profile",
            "id": "did:jolo:test;jolocomPubProfile",
            "serviceEndpoint": "ipfs://ipfsHash",
            "type": "JolocomPublicProfile",
          },
        ],
      }
    `);
  });

  it("should remove public profile if non is passed as second argument", async () => {
    const didDoc = await registry.commitDidDoc(
      testPrivateKey,
      testDidDocWithPublicProfile
    );
    expect(didDoc).toMatchInlineSnapshot(`
      Object {
        "@context": "https://w3id.org/did/v1",
        "id": "did:jolo:test",
        "service": Array [],
      }
    `);
  });
});
