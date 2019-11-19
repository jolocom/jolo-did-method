require("dotenv").config()
const HDWalletProvider = require("@truffle/hdwallet-provider")

module.exports = {
    networks: {
        rinkeby: {
            provider: () => {
                return new HDWalletProvider(process.env.MNEMONIC, `https://rinkeby.infura.io/v3/${process.env.PROJECT_ID}`)
            },
            network_id: 4
        },
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*"
        }
    },
    compilers: {
        solc: {
            version: "^0.4.26",
        }
    }
};