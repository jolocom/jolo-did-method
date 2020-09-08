import { IDidDocument } from "@decentralized-identity/did-common-typescript";

export const privateKey = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
export const publicKey = '03a34b99f22c790c4e36b2b3c2c35a36db06226e41c692fc82b8b56ac1c540c5bd'

export const testEncodedUnsignedTx = '0xf8a7808504e3b29200830493e094d4351c3f383d79ba378ed1875275b1e7b960f12080b8845ab5ee37cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000045177735a00000000000000000000000000000000000000000000000000000000'

export const mockSignature = {
  r: 'a'.repeat(64),
  s: 'b'.repeat(64),
  recoveryParam: 1
}

export const didDocument: { id: string, "@context": 'https://w3id.org/did/v1' } = {
  id: 'did:jolo:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
  "@context": 'https://w3id.org/did/v1'
}

export const publicProfile = {
  data: "some data about the identity, normally a verifiable credential"
}
