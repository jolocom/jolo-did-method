const HDWalletProvider = require("truffle-hdwallet-provider")
const mnemonic = ''

module.exports = {
  networks: {
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/G58gg0SgiNhbpN1U5ho3")
      },
      network_id: "*"
    },   
    development: {
      host: "localhost",
      from: "0xab7fcaeb4dfcc37309f7370438f0710713dbbcbe",
      port: 8545,
      network_id: "*"
    }
  }
}
