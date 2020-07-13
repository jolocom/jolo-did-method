import { getRegistry } from "../ts";
import RegistryContract from "jolocom-registry-contract";
import { IpfsStorageAgent } from "../ts/ipfs";
import { didDocument, publicProfile, publicKey, mockSignature, testEncodedUnsignedTx } from "./test.data";

// TODO Bring back tests which ensure the serviceEndpoint manipulations are all correct
describe("DID Registry", () => {
  let contractMock, ipfsMock;

  let registry: ReturnType<typeof getRegistry>;

  beforeAll(()=>{
    registry = getRegistry();
  })

  beforeEach(() => {
    contractMock = jest
      .spyOn(RegistryContract.prototype, "broadcastTransaction")
      .mockResolvedValue({ status: 1 });

    ipfsMock = jest
      .spyOn(IpfsStorageAgent.prototype, "storeJSON")
      .mockResolvedValue("QwsZ")
  });

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("should correctly assemble, and broadcast transaction", async () => {
    const tx = await registry.publishDidDocument(Buffer.from(publicKey.slice(2), 'hex'), didDocument)
 
    await registry.broadcastTransaction(
      tx, mockSignature
    );

    expect(contractMock).toHaveBeenLastCalledWith(
      testEncodedUnsignedTx,
      mockSignature
    )

    expect(ipfsMock).toHaveBeenLastCalledWith(didDocument)
  });

  it("should add public profile to DID doc", async () => {
    const publicProfileSection = await registry.publishPublicProfile(didDocument.id, publicProfile)
    const tx = await registry.publishDidDocument(Buffer.from(publicKey.slice(2), 'hex'), didDocument)
    await registry.broadcastTransaction(
      tx, mockSignature
    );

    expect(publicProfileSection).toStrictEqual({
      description: "Verifiable Credential describing entity profile",
      id: "did:jolo:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc;jolocomPubProfile",
      serviceEndpoint: "ipfs://QwsZ",
      type: "JolocomPublicProfile"
    })

    expect(ipfsMock).toHaveBeenNthCalledWith(1, publicProfile)
    expect(ipfsMock).toHaveBeenNthCalledWith(2, didDocument)
    expect(contractMock).toHaveBeenLastCalledWith(tx, mockSignature)
  });
});
