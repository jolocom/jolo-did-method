# @jolocom/jolo-did-registrar

This module encapsulates the logic required to anchor Jolocom Identities using an instance of the Jolocom [registry smart contract](../registry-contract) and an IPFS gateway.
Additional functionality for updating the DID Document with a public profile is also exposed.

For logic related to resolving identities and associated public profiles, check out the [@jolocom/jolo-did-resolver](../jolo-did-resolver) package.

*This is a lower level module, [integrated with the Jolocom Library](https://github.com/jolocom/jolocom-lib/blob/next/ts/didMethods/jolo/registrar.ts#L33) for anchoring and updating `did:jolo` identities.*
