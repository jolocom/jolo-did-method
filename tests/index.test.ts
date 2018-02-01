import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

import testData from './data/testData'

import EthereumResolver from '../ts/index'

chai.use(chaiAsPromised)
const expect = chai.expect


describe('Ethereum Resolver', () => {
  const rpcEndpoint = 'http://localhost:8545'

  const ethResolver = new EthereumResolver(testData.contrAddr, rpcEndpoint)
  it('Should correctly register a user\'s DDO hash', async () => {
    const hash = await ethResolver.updateDIDRecord(
      testData.firstTestAccount, testData.testUserDID,
      testData.mockDDOHash
    )

    expect(await ethResolver.resolveDID(testData.testUserDID))
      .to.equal(testData.mockDDOHash)
  })

  it('Should return error in case writting record fails', async () => {
    await expect(ethResolver.updateDIDRecord(
      testData.secondTestAcount,
      testData.testUserDID,
      testData.mockDDOHash
    )).to.be.rejectedWith(
      'Returned error: VM Exception while processing transaction: revert'
    )
  })

  it('Should correctly query contract for the user\'s DDO hash', async () => {
    const hash = await ethResolver.resolveDID(testData.testUserDID)
    expect(hash).to.equal(testData.mockDDOHash)
  })

  it('Should return error in case reading record fails', async () => {
    await expect(ethResolver.resolveDID('invalidInput')).to.be.rejected
  })
})
