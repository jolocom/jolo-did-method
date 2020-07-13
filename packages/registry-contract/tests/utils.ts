import testData from "./testData";
import { ethers, Contract } from "ethers";
const RegistryContract = require('../build/contracts/Registry.json')

const ganache = require('ganache-core')

const PORT = 8545
export const ganacheUri = `http://localhost:${ PORT }`;

export function startGanache() {
  const balance = 1e+24
  const server = ganache.server({
    accounts: [
      { secretKey: '0x' + testData.firstKey, balance, },
      { secretKey: '0x' + testData.secondKey, balance, },
    ],
  })

  server.listen(PORT, (err, blockchain) => blockchain)
  return server
}

export async function deployIdentityContract(): Promise<Contract> {
  let provider = new ethers.providers.JsonRpcProvider(ganacheUri)
  let wallet = new ethers.Wallet(Buffer.from(
    testData.firstKey, 'hex'
  ), provider)

  let factory = new ethers.ContractFactory(RegistryContract.abi, RegistryContract.bytecode, wallet)
  return factory.deploy()
}
