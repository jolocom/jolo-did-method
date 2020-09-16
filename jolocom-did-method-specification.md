# Jolocom DID Method Specification
V0.1, Charles Cunningham, Jolocom
## Introduction
The Jolocom distributed identity system aims to provide a secure, robust and flexible implementation of the DID and Verifiable Claims specifications published by the W3C and the Decentralised Identity Foundation. It’s core technologies are the Ethereum blockchain and the Interplanetary File System (IPFS).
### Ethereum
Ethereum is a public permissionless blockchain and smart contract execution environment. The Ethereum Virtual Machine (EVM) provides certainty and security about code execution by being based upon a public blockchain.
### IPFS
IPFS is a distributed, cryptographic Content-Addressable Storage (CAS) network. IPFS enables distributed storage of content over a network with the content being addressable via its hash. An important concept to note is that if data changes, so does it's address.
## Overview
The Jolocom DID method uses IPFS as a decentralised CAS layer for DID Documents. A deployed smart contract provides a mapping from a DID to an IPFS hash address of the corrosponding DID Document. This enables DID Documents on IPFS to be effectively addressed via their DIDs. 
## Specification
### Method DID Format
Jolocom DIDs are identifiable by their did\:jolo: method string and conform to the [Generic DID Scheme](https://w3c-ccg.github.io/did-spec/#the-generic-did-scheme).
### DID Creation
The creation of a DID follows a few steps:
1. Generate 32 bytes of entropy
2. From the entropy, generate an Ethereum key pair
3. From the Ethereum key pair, take the keccak256 hash of the public key
The hash from step 3 is your DID.
### DID Registration/Anchoring
DID Anchoring refers to creating the mapping from DID to IPFS address on the smart contract using the setRecord function, effectively 'anchoring' the DID to the smartcontract and making its DID Document accessable with only the DID. This anchoring process is analogous the the Create step of a CRUD database. This process is also tied to the creation of the DID, as the Ethereum key pair used to generate the DID should also be the one to perform anchoring transaction on the smart contract.
### DID Document Resolution
DID Document resolution is achieved by querying the registry smartcontract getRecord function with a DID. If that DID is registered, an IPFS address will be returned. Otherwise, an empty address is returned. This IPFS address can then be resolved through IPFS to the DID Document.
### DID Document Updating and Deleting
IPFS addresses are hashes of their content, so an updated DID Document will also have a new IPFS address. Thus updating simply uses the setRecord smartcontract function again with the same DID and the new IPFS hash of the updated DID Document. Deletion, similarly, is updating the registry to return an all-0 byte string, as if it had never been initialised.
## Key Management
### Key Recovery
Writing to the Jolocom registry mapping contract requires control over the private key used to anchor the DID, so any key recovery method which applies to Ethereum keys can be applied here. This can involve seed phrases stored in an analogue manner among other methods.
### Key Revocation
As there is no centralised control of the registry contract, no party can revoke the keys of DID control of another party under the Jolocom system.
## Privacy and Security Considerations
### Key Control
As mentioned in the Key Recovery section, the entity which controls the private key which anchored the DID also effectively controls the DID Document which the DID resolves to. Thus great care should be taken to ensure that the private key is kept private. Methods for ensuring key privacy are outside the scope of this document.
### DID Document Public Profile
The DID Document anchored with the registry contract can contain any content, though it is recommended that it conforms to the [W3C DID Document Specificaiton](https://w3c-ccg.github.io/did-spec/#did-documents). As registered DIDs can be resolved by anyone, care should be taken to only update the registry to resolve to DID Documents which DO NOT expose any sensitive personal information, or information which you may not wish to be public.
### IPFS and Cannonicity
IPFS allows any entity to store content publically. A common misconception is that anyone can edit content, however the content-addressability of the platform means that this new content will have a different address to the original. Thus while any entity can copy and modify an anchored DID Document, they cannot change the document that a DID resolves to via the registry smartcontract unless they control the private key which anchored it.
