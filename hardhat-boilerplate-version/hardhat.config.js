require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  networks:{
    goerli: {
      url: "https://goerli.infura.io/v3/5667a1f708754d8687b99382f8b3a92a",
      accounts: [process.env.GOERLI_PRIVATE_KEY],
    },
  },
};
