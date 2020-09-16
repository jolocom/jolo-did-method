# @jolocom/jolo-did-registrar

This module encapsulates the logic required to anchor Jolocom Identities using an instance of the Jolocom [registry smart contract](../registry-contract) and an IPFS gateway.
Additional functionality for updating the DID Document with a public profile is also exposed.

*Please note that this module is not meant to be used directly, but rather through an integration with the Jolocom Library ([source](https://github.com/jolocom/jolocom-lib/blob/next/ts/didMethods/jolo/registrar.ts#L33)).*

For logic related to resolving identities and associated public profiles, check out the [@jolocom/jolo-did-resolver](../jolo-did-resolver) package.
