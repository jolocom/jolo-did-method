"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wallet = require("ethereumjs-wallet");
var Transaction = require("ethereumjs-tx");
var RegistryContract = require('../build/contracts/Registry.json');
var Web3 = require('web3');
var TestDeployment = (function () {
    function TestDeployment() {
    }
    TestDeployment.deployIdentityContract = function (web3, from) {
        return new Promise(function (resolve, reject) {
            var contract = new web3.eth.Contract(RegistryContract.abi);
            contract.deploy({
                data: RegistryContract.bytecode
            }).send({
                gas: 467000,
                from: from
            }).on('receipt', function (receipt) {
                return resolve(receipt.contractAddress);
            }).on('error', reject);
        });
    };
    return TestDeployment;
}());
exports.TestDeployment = TestDeployment;
var EthereumResolver = (function () {
    function EthereumResolver(address, providerUri) {
        var provider = new Web3.providers.HttpProvider(providerUri);
        this.web3 = new Web3(provider);
        this.contractAddress = address;
        this.indexContract = new this.web3.eth.Contract(RegistryContract.abi, address);
    }
    EthereumResolver.prototype.resolveDID = function (did) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var keyHash = _this._stripMethodPrefix(did);
            _this.indexContract.methods.getRecord(keyHash).call(function (error, result) {
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            });
        });
    };
    EthereumResolver.prototype.updateDIDRecord = function (ethereumKey, did, newHash) {
        var _this = this;
        var gasLimit = 250000;
        var gasPrice = 20e9;
        var w = wallet.fromPrivateKey(ethereumKey);
        var address = w.getAddress().toString('hex');
        var keyHash = this._stripMethodPrefix(did);
        var callData = this.indexContract.methods.setRecord(keyHash, newHash)
            .encodeABI();
        return this.web3.eth.getTransactionCount(address).then(function (nonce) {
            var tx = new Transaction({
                nonce: nonce,
                gasLimit: gasLimit,
                gasPrice: gasPrice,
                data: callData,
                to: _this.contractAddress
            });
            tx.sign(ethereumKey);
            var serializedTx = tx.serialize();
            return new Promise(function (resolve, reject) {
                _this.web3.eth.sendSignedTransaction("0x" + serializedTx.toString('hex'))
                    .on('confirmation', function () { return resolve(); })
                    .on('error', function (err) { return reject(err); });
            });
        });
    };
    EthereumResolver.prototype._stripMethodPrefix = function (did) {
        return "0x" + did.substring(did.lastIndexOf(':') + 1);
    };
    return EthereumResolver;
}());
exports.default = EthereumResolver;
//# sourceMappingURL=index.js.map