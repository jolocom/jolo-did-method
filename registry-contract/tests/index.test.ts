import { deployIdentityContract, ganacheUri, startGanache } from "./utils";
import testData from './testData'
import RegistryContract from "../ts";


describe('Registry Contract', () => {
  let ganacheServer, registryContract: RegistryContract
  beforeAll(async () => {
    ganacheServer = startGanache()
    const contractAddress = await deployIdentityContract()

    registryContract = new RegistryContract(contractAddress, ganacheUri)
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
    await registryContract.updateDID(
      privateKey,
      testData.testUserDID,
      testData.mockDDOHash
    )
    const hash = await registryContract.resolveDID(testData.testUserDID)
    expect(hash).toEqual(testData.mockDDOHash)
  })

  it('Should return error in case writing record fails', async () => {
    const privateKey = Buffer.from(testData.secondKey, 'hex')

    await expect(registryContract.updateDID(
      privateKey,
      testData.testUserDID,
      testData.mockDDOHash
    )).rejects
  })

  it('Should correctly query contract for the user\'s DDO hash', async () => {
    const hash = await registryContract.resolveDID(testData.testUserDID)
    expect(hash).toEqual(testData.mockDDOHash)
  })

  it('Should return error in case reading record fails', async () => {
    await expect(registryContract.resolveDID('did:jolo:random')).rejects
  })

  it('should reject if no jolo DID is used', async () => {
    const uportDID = 'did:uport:test'
    await expect(registryContract.resolveDID(uportDID)).rejects.toBe('Only "jolo" DIDs are allowed')
    await expect(registryContract.updateDID(Buffer.from(testData.firstKey, "hex"), uportDID, 'newHash')).rejects.toBe('Only "jolo" DIDs are allowed')
  });
})
