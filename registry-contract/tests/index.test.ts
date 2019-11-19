import testData from './testData'

import { deployIdentityContract, ganacheUri, startGanache } from "./utils";
import EthereumConnector from "../ts";


describe('Ethereum Resolver', () => {
  let ganacheServer, ethResolver
  beforeAll(async () => {
    ganacheServer = startGanache()
    const contractAddress = await deployIdentityContract()

    ethResolver = new EthereumConnector(contractAddress, ganacheUri)
  })

  afterAll(() => {
    ganacheServer.close()
  })

  it('Should correctly register a user\'s DDO hash', async () => {
    const ethereumKey = Buffer.from(testData.firstKey, 'hex')
    await ethResolver.updateDIDRecord(
      ethereumKey,
      testData.testUserDID,
      testData.mockDDOHash
    )
    const hash = await ethResolver.resolveDID(testData.testUserDID)
    expect(hash).toEqual(testData.mockDDOHash)
  })

  it('Should return error in case writting record fails', async () => {
    const ethereumKey = Buffer.from(testData.secondKey, 'hex')

    await expect(ethResolver.updateDIDRecord(
      ethereumKey,
      testData.testUserDID,
      testData.mockDDOHash
    )).rejects
  })

  it('Should correctly query contract for the user\'s DDO hash', async () => {
    const hash = await ethResolver.resolveDID(testData.testUserDID)
    expect(hash).toEqual(testData.mockDDOHash)
  })

  it('Should return error in case reading record fails', async () => {
    await expect(ethResolver.resolveDID('invalidInput')).rejects
  })
})
