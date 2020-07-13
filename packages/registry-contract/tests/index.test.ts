import { deployIdentityContract, ganacheUri, startGanache } from "./utils"
import testData from './testData'
import RegistryContract from "../ts"
import { Wallet } from "ethers"
import { parseTransaction } from "ethers/lib/utils"

describe('Registry Contract', () => {
  let ganacheServer, registryContract: RegistryContract

  beforeAll(async () => {
    ganacheServer = await startGanache()
    const contract = await deployIdentityContract()
    registryContract = new RegistryContract(contract.address, ganacheUri)
  })

  afterAll(() => {
    ganacheServer.close()
  })

  it('Should return empty string if no record exists', async () => {
    const hash = await registryContract.resolveDID(testData.testUserDID)
    expect(hash).toBe('')
  })

  it('Should correctly register a user\'s DDO hash', async () => {
    const privateKey = Buffer.from(testData.firstKey, 'hex')

    const tx = await registryContract.prepareAnchoringTransaction(
      testData.testUserDID,
      testData.mockDDOHash,
      Buffer.from(new Wallet(privateKey).publicKey.slice(2), 'hex')
    )

    const rawTx = await new Wallet(privateKey).signTransaction(parseTransaction(tx))

    await registryContract.sendRawTransaction(rawTx).then(tx => tx.wait())

    return expect(
      await registryContract.resolveDID(testData.testUserDID)
    ).toEqual(testData.mockDDOHash)
  })

  it('Should return error in case writing record fails', async () => {
    const privateKey = Buffer.from(testData.secondKey, 'hex')

    const tx = await registryContract.prepareAnchoringTransaction(
      testData.testUserDID,
      testData.mockDDOHash,
      Buffer.from(new Wallet(privateKey).publicKey.slice(2), 'hex')
    )

    const rawTx = await new Wallet(privateKey).signTransaction(parseTransaction(tx))

    return expect(registryContract.sendRawTransaction(rawTx)).rejects.toBeInstanceOf(Error)
  })

  it('Should correctly query contract for the user\'s DDO hash', async () => {
    const hash = await registryContract.resolveDID(testData.testUserDID)
    expect(hash).toEqual(testData.mockDDOHash)
  })

  it('Should return error in case reading record fails', async () => {
    return expect(registryContract.resolveDID('did:jolo:random')).rejects.toBeInstanceOf(Error)
  })

  it('should reject if no jolo DID is used', async () => {
    const uportDID = 'did:uport:test'

    expect(registryContract.prepareAnchoringTransaction(
      uportDID,
      testData.mockDDOHash,
      Buffer.from(
        new Wallet(Buffer.from(testData.firstKey, 'hex')).publicKey.slice(2), 'hex'
      )
    )).rejects.toBe('Only "jolo" DIDs are allowed')

    expect(registryContract.resolveDID(uportDID)).rejects.toBe('Only "jolo" DIDs are allowed')
  });
})
