require("dotenv").config();
const HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = process.env.MNENOMIC;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
      // type: "quorum"
      // you can uncomment type and use the id of other blockchains,
      // please visit the truffle documentation for more info
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(mnemonic, process.env.YOUR_RINKEBY_TEST_URL
          ),
      network_id: "4",
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: '0.8.7',
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
