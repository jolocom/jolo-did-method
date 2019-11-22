import { getRegistry } from "../ts";
import EthereumResolver from "jolocom-registry-contract";
import { IpfsStorageAgent } from "../ts/ipfs";
import { didDocument, didDocumentWithPublicProfile, privateKey, publicProfile } from "./test.data";

describe("DID Registry", () => {
  let contractMock, ipfsMock;
  let registry: ReturnType<typeof getRegistry>;

  beforeAll(()=>{
    registry = getRegistry();
  })

  beforeEach(() => {
    contractMock = jest
      .spyOn(EthereumResolver.prototype, "updateDIDRecord")
      .mockResolvedValue("");
    ipfsMock = jest
      .spyOn(IpfsStorageAgent.prototype, "storeJSON")
      .mockResolvedValueOnce("firstCall")
      .mockResolvedValueOnce("secondCall");
  });

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("should store DID Doc in registry", async () => {
    const didDoc = await registry.commitDidDoc(privateKey, didDocument);
    expect(contractMock.mock.calls[0][2]).toEqual("firstCall");
    expect(didDoc).toMatchInlineSnapshot(`
      Object {
        "@context": "https://w3id.org/did/v1",
        "id": "did:jolo:test",
      }
    `);
  });

  it("should add public profile to DID doc", async () => {
    const didDoc = await registry.commitDidDoc(
      privateKey,
      didDocument,
      publicProfile
    );
    expect(ipfsMock.mock.calls[0][0]).toEqual(publicProfile);
    expect(ipfsMock).toBeCalledTimes(2);
    expect(contractMock.mock.calls[0][2]).toBe('secondCall')
    expect(didDoc).toMatchInlineSnapshot(`
      Object {
        "@context": "https://w3id.org/did/v1",
        "id": "did:jolo:test",
        "service": Array [
          Object {
            "description": "Verifiable Credential describing entity profile",
            "id": "did:jolo:test;jolocomPubProfile",
            "serviceEndpoint": "ipfs://firstCall",
            "type": "JolocomPublicProfile",
          },
        ],
      }
    `);
  });

  it("should remove public profile if non is passed as second argument", async () => {
    const didDoc = await registry.commitDidDoc(
      privateKey,
      didDocumentWithPublicProfile
    );
    expect(didDoc).toMatchInlineSnapshot(`
      Object {
        "@context": "https://w3id.org/did/v1",
        "id": "did:jolo:test",
        "service": Array [],
      }
    `);
  });

  it("should update public profile", async () => {
    const newPubProfile = { data: "hello world" }
    const didDoc = await registry.commitDidDoc(
      privateKey,
      didDocumentWithPublicProfile,
      newPubProfile
    );
    expect(ipfsMock.mock.calls[0][0]).toBe(newPubProfile)
    expect(ipfsMock).toBeCalledTimes(2);

    expect(didDoc).toMatchInlineSnapshot(`
      Object {
        "@context": "https://w3id.org/did/v1",
        "id": "did:jolo:test",
        "service": Array [
          Object {
            "description": "Verifiable Credential describing entity profile",
            "id": "did:jolo:test;jolocomPubProfile",
            "serviceEndpoint": "ipfs://firstCall",
            "type": "JolocomPublicProfile",
          },
        ],
      }
    `);
  });
});
