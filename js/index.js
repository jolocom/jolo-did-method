"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RegistryContract = require('../build/contracts/Registry.json');
var Web3 = require('web3');
var EthereumResolver = (function () {
    function EthereumResolver(address, providerUri) {
        var provider = new Web3.providers.HttpProvider(providerUri);
        this.web3 = new Web3(provider);
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
    EthereumResolver.prototype.updateDIDRecord = function (sender, did, newHash) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var keyHash = _this._stripMethodPrefix(did);
            _this.indexContract.methods.setRecord(keyHash, newHash).send({
                from: sender,
            }, function (error, result) {
                if (error) {
                    return reject(error);
                }
                return resolve();
            });
        });
    };
    EthereumResolver.prototype._stripMethodPrefix = function (did) {
        return did.substring(did.lastIndexOf(':') + 1);
    };
    return EthereumResolver;
}());
exports.default = EthereumResolver;
//# sourceMappingURL=index.js.map