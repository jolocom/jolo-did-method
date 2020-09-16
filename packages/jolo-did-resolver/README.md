# @jolocom/jolo-did-resolver
This module encapsulates the logic required to resolve Jolocom Identities using an instance of the Jolocom [registry smart contract](../registry-contract) and an IPFS gateway.
The exported interface is compatible with the [DIF DID-Resolver](https://github.com/decentralized-identity/did-resolver) module.

*Please note that this module is not meant to be used directly, but rather through an integration with either the Jolocom Library ([source](https://github.com/jolocom/jolocom-lib/blob/next/ts/didMethods/jolo/resolver.ts#L31)), or the DIF DID-Resolver module (as shown in the example below)*

## Usage examples
In combination with the [DIF DID-Resolver](https://github.com/decentralized-identity/did-resolver):

```typescript
import { getResolver } from "@jolocom/jolo-did-resolver";
import { Resolver } from "did-resolver";

const resolver = new Resolver(getResolver());
const didDocument = await resolver.resolve(did);
// didDocument now contains the corresponding Did Document in JSON form.
```

A number of configuration options can be passed to the `getResolver` function, as shown in this example:

```typescript
import { getResolver } from "@jolocom/jolo-did-resolver";
import { Resolver } from "did-resolver";

// The Ethereum gateway to use for reading the registry contract state and broadcasting transactions
const ethGatewayEndpoint = 'https://rinkeby.infura.io/v3/000085cafc1934feaa09ccb83630d5d8'

// The Ethereum address of a instance of the registry smart contract to use for anchoring / resolution
const registryContractAddress = '0xD333333333333333333AAAAAAAAAAFFFFFFFFF20'

// A public IPFS gateway which can be used to store and retrieve documents
const ipfsGatewayEndpoint = 'https://ipfs.example.com:443'

const resolver = new Resolver(getResolver(ethGatewayEndpoint, registryContractAddress, ipfsGatewayEndpoint));
const didDocument = await resolver.resolve(did);
// didDocument now contains the corresponding Did Document in JSON form.
```

If no arguments are passed to the `getResolver()` function, [default arguments are used](https://github.com/jolocom/jolo-did-method/blob/master/packages/jolo-did-resolver/ts/index.ts#L5).
