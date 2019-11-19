import testData from "./testData";
import { ethers } from "ethers";
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

export async function deployIdentityContract(): Promise<string> {
  console.log('Deploying Test Contract')
  let provider = new ethers.providers.JsonRpcProvider(ganacheUri)
  let wallet = new ethers.Wallet(testData.firstKey, provider)
  let factory = new ethers.ContractFactory(RegistryContract.abi, RegistryContract.bytecode, wallet)
  let contract = (await factory.deploy());
  await contract.deployed()
  return contract.address
}