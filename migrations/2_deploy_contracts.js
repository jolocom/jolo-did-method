const Registry = artifacts.require("./Registry.sol");

module.exports = (deployer) => {
  deployer.deploy(Registry).then(() => {
    console.log('Deployed at: ', Registry.address)
  });
};
