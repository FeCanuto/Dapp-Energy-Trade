const RenewableEnergyToken = artifacts.require('RenewableEnergyToken');
const EnergyTrade = artifacts.require('EnergyTrade');

module.exports = async function (deployer) {
    await deployer.deploy(RenewableEnergyToken);
    const token = await RenewableEnergyToken.deployed();

    await deployer.deploy(EnergyTrade, token.address);
  };
  