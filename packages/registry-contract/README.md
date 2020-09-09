# RegistryContract
The repository contains the source code for the Ethereum smart contract used as part of our `did:jolo` [method spec](../jolocom-did-method-specification.md) implementation. The project also includes a configured [truffle](https://github.com/trufflesuite/truffle) environment for compiling, testing and deploying the contract, and a wrapper class allowing for easier integration.

*This is a lower level module used by the jolo-did-registrar ([integration](https://github.com/jolocom/jolo-did-method/blob/master/packages/jolo-did-registrar/ts/index.ts#L11)) and jolo-did-resolver ([integration](https://github.com/jolocom/jolo-did-method/blob/master/packages/jolo-did-resolver/ts/index.ts#L10)) packages to offer a more consumable API.*
