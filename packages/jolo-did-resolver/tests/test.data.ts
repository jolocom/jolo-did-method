import { DIDDocument } from "did-resolver";

export const testDid = 'did:jolo:1fb352353ff51248c5104b407f9c04c3666627fcf5a167d693c9fc84b75964e2'
export const testDidDoc = {
  '@context': "https://w3id.org/did/v1",
  "authentication": [
    {
      "publicKey": `${testDid}#keys-1`,
      "type": "Secp256k1SignatureAuthentication2018"
    }
  ],
  "created": "2019-09-26T04:38:43.366Z",
  "id": testDid,
  "proof": {
    "created": "2019-09-26T04:38:43.383Z",
    "creator": `${testDid}#keys-1`,
    "nonce": "fe7aced5dcc88634",
    "signatureValue": "2b1e290a61925c361b1ddd97636b0ac733b2646f9d641fd50bf6729f665963e10c6ce9cfa8d40d17756446516f4739f3536a872ca1cbd66f8f5016dfddb097bf",
    "type": "EcdsaKoblitzSignature2016"
  },
  "publicKey": [
    {
      "id": `${testDid}#keys-1`,
      "owner": testDid,
      "publicKeyHex": "0298a5f231fc9224ca466bdbd0b27cb34d27939d0e8aa4b65ba4ef1ed805f14975",
      "type": "Secp256k1VerificationKey2018"
    }
  ],
  "service": []
};

export const testDidDocWithPublicProfile: DIDDocument = {
  '@context': 'https://w3id.org/did/v1',
  id: testDid,
  publicKey: [
    {
      "id": `${ testDid }#keys-1`,
      "owner": testDid,
      "publicKeyHex": "0298a5f231fc9224ca466bdbd0b27cb34d27939d0e8aa4b65ba4ef1ed805f14975",
      "type": "Secp256k1VerificationKey2018"
    }
  ],
  service: [
    {
      id: `${ testDid };jolocomPubProfile`,
      type: 'JolocomPublicProfile',
      serviceEndpoint: 'ipfs://testHash',
    }
  ]
};