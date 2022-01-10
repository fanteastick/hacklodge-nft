require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

// To deploy to goerli testnet, uncomment the code below.
// You also need to set the enviornment variable GOERLI_PRIVATE_KEY,
// you can run `export GOERLI_PRIVATE_KEY=<private-key>` in your command line.
module.exports = {
  solidity: "0.8.0",
  // networks:{
  //   goerli: {
  //     url: "https://goerli.infura.io/v3/5667a1f708754d8687b99382f8b3a92a",
  //     accounts: [process.env.GOERLI_PRIVATE_KEY],
  //   },
  // },
};
