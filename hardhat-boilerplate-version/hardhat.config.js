require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  networks:{
    ropsten: {
      url: "https://ropsten.infura.io/v3/32f8ddb78a434579a05e2a99dcbf0770", // ez: should create ur own for ur own project
      accounts: ['8df54a447dc444abbd82506bc6b8fb082f56629896efe0bb0c651a614b853423'], // LOL DON"T POST THIS
    },
  },
};
