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
      port: 8545,
      network_id: "*"
    }
  }
}
