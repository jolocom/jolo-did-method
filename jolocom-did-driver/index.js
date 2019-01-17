const EthResolver = require('jolocom-registry-contract')
const IPFS = require('ipfs-mini')

const express = require('express')
const driver = express()

const jolocomEthereumResolver = new EthResolver({
    providerUrl: 'https://rinkeby.infura.io/',
    contractAddress: '0xd4351c3f383d79ba378ed1875275b1e7b960f120'
})

const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

driver.get('/1.0/identifiers/*', function (req, res) {
    const url = req.url
    const regex = /\/1.0\/identifiers\/(did:.*)/
    const did = regex.exec(url)[1]

    console.log(did)

    const ddoHash = jolocomEthereumResolver.resolveDID(did)

    ipfs.cat(ddoHash, function(err, result) {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    })
})

var server = driver.listen(8081, function () {
    console.log("Jolocom Resolver driver active on port 8081...")
})