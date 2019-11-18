export const testDid = 'did:jolo:1fb352353ff51248c5104b407f9c04c3666627fcf5a167d693c9fc84b75964e2'
export const testDidDoc = {
  "@context": [
    {
      "AuthenticationSuite": "sec:AuthenticationSuite",
      "CryptographicKey": "sec:Key",
      "LinkedDataSignature2016": "sec:LinkedDataSignature2016",
      "authentication": "sec:authenticationMethod",
      "created": {
        "@id": "dc:created",
        "@type": "xsd:dateTime"
      },
      "creator": {
        "@id": "dc:creator",
        "@type": "@id"
      },
      "dc": "http://purl.org/dc/terms/",
      "didv": "https://w3id.org/did#",
      "digestAlgorithm": "sec:digestAlgorithm",
      "digestValue": "sec:digestValue",
      "domain": "sec:domain",
      "entity": "sec:entity",
      "expires": {
        "@id": "sec:expiration",
        "@type": "xsd:dateTime"
      },
      "id": "@id",
      "name": "schema:name",
      "nonce": "sec:nonce",
      "normalizationAlgorithm": "sec:normalizationAlgorithm",
      "owner": {
        "@id": "sec:owner",
        "@type": "@id"
      },
      "privateKey": {
        "@id": "sec:privateKey",
        "@type": "@id"
      },
      "proof": "sec:proof",
      "proofAlgorithm": "sec:proofAlgorithm",
      "proofType": "sec:proofType",
      "proofValue": "sec:proofValue",
      "publicKey": {
        "@container": "@set",
        "@id": "sec:publicKey",
        "@type": "@id"
      },
      "publicKeyHex": "sec:publicKeyHex",
      "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
      "requiredProof": "sec:requiredProof",
      "revoked": {
        "@id": "sec:revoked",
        "@type": "xsd:dateTime"
      },
      "schema": "http://schema.org/",
      "sec": "https://w3id.org/security#",
      "signature": "sec:signature",
      "signatureAlgorithm": "sec:signatureAlgorithm",
      "signatureValue": "sec:signatureValue",
      "type": "@type",
      "xsd": "http://www.w3.org/2001/XMLSchema#"
    }
  ],
  "authentication": [
    {
      "publicKey": "did:jolo:1fb352353ff51248c5104b407f9c04c3666627fcf5a167d693c9fc84b75964e2#keys-1",
      "type": "Secp256k1SignatureAuthentication2018"
    }
  ],
  "created": "2019-09-26T04:38:43.366Z",
  "id": "did:jolo:1fb352353ff51248c5104b407f9c04c3666627fcf5a167d693c9fc84b75964e2",
  "proof": {
    "created": "2019-09-26T04:38:43.383Z",
    "creator": "did:jolo:1fb352353ff51248c5104b407f9c04c3666627fcf5a167d693c9fc84b75964e2#keys-1",
    "nonce": "fe7aced5dcc88634",
    "signatureValue": "2b1e290a61925c361b1ddd97636b0ac733b2646f9d641fd50bf6729f665963e10c6ce9cfa8d40d17756446516f4739f3536a872ca1cbd66f8f5016dfddb097bf",
    "type": "EcdsaKoblitzSignature2016"
  },
  "publicKey": [
    {
      "id": "did:jolo:1fb352353ff51248c5104b407f9c04c3666627fcf5a167d693c9fc84b75964e2#keys-1",
      "owner": "did:jolo:1fb352353ff51248c5104b407f9c04c3666627fcf5a167d693c9fc84b75964e2",
      "publicKeyHex": "0298a5f231fc9224ca466bdbd0b27cb34d27939d0e8aa4b65ba4ef1ed805f14975",
      "type": "Secp256k1VerificationKey2018"
    }
  ],
  "service": []
}