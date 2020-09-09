# Jolocom DID Method
This workspace includes the `did:jolo` [DID method specification](./packages/jolocom-did-method-specification.md),
as well as implementations for compliant, Ethereum / IPFS based, resolver and registrar classes.

# Contents:
The [packages](./packages/) directory contains the following modules:

- [registry-contract](./packages/registry-contract): Wrapper for deploying / interacting with an instance of the Jolocom registry Ethereum smart contract. 
Both the resolver and the registrar can be configured to use a custom registry contract address (the default address is the [Jolocom registry contract](https://rinkeby.etherscan.io/address/0xd4351c3f383d79ba378ed1875275b1e7b960f120#code)\).

- [jolo-did-registrar](./packages/jolo-did-registrar): Module implementing the logic for anchoring and updating Jolocom Identities using an "Registry" Ethereum smart contract and IPFS. 
Relies on the `registry-contract` module for assembling / broadcasting Ethereum transactions.

- [jolo-did-resolver](./packages/jolo-did-resolver): Module implementing the logic for resolving Jolocom Identities using an instance of the Jolocom Registry contract and IPFS. 
The module is compatible with the interface required by the [DIF DID-Resolver](https://github.com/decentralized-identity/did-resolver) package.

- [jolocom-did-driver](./packages/jolocom-did-driver): `did:jolo` integration for the [DIF Universal Resolver](https://github.com/decentralized-identity/universal-resolver).
