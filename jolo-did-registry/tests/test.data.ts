import { IDidDocument } from "@decentralized-identity/did-common-typescript";

export const privateKey = '1234567890'
export const didDocument: { id: string, "@context": 'https://w3id.org/did/v1' } = {
  id: 'did:jolo:test',
  "@context": 'https://w3id.org/did/v1'
}

export const publicProfile = {
  data: "some data about the identity, normally a verifiable credential"
}

export const didDocumentWithPublicProfile: IDidDocument = {
  "@context": "https://w3id.org/did/v1",
  "id": "did:jolo:test",
  "service": [
    {
      // @ts-ignore
      "description": "Verifiable Credential describing entity profile",
      "id": "did:jolo:test;jolocomPubProfile",
      "serviceEndpoint": "ipfs://ipfsHash",
      "type": "JolocomPublicProfile",
    },
  ],
}