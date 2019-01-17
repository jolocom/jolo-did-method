const JolocomResolver = require('jolocom-lib').JolocomLib.registries.jolocom

const express = require('express')
const driver = express()

const port = 8080

const JR = JolocomResolver.create()

driver.get('/1.0/identifiers/:did', function (req, res) {
    const did = req.params.did

    console.log(did)

    JR.resolve(did).then(function(identity) {
        console.log(identity.didDocument.toJSON())
        res.send(identity.didDocument.toJSON())
    }).catch(function(reason) {
        res.send()
    })

})

var server = driver.listen(port, function () {
    console.log("Jolocom Resolver driver active on port 8080...")
})