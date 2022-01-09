# Hardhat Boilerplate

This project shows you how to build a DApp (Hack Lodge NFT) end to end. We try to include only the bare minimum for you to build a DApp. You can use this as the starting point for your DApp.

It is adapted from [Hardhat Hackathon Boilerplate](https://github.com/nomiclabs/hardhat-hackathon-boilerplate), and you can use it with the [Hardhat Beginners Tutorial](https://hardhat.org/tutorial).

## Quick start

The first things you need to do are cloning this repository and installing its
dependencies:

```sh
git clone git@github.com:veronicaz41/hacklodge-nft.git
cd hacklodge-nft/hardhat-boilerplate-version
yarn install
```

Once installed, let's run Hardhat's testing network:

```sh
npx hardhat node
```

Then, on a new terminal, go to the repository's root folder and run this to
deploy your contract:

```sh
npx hardhat run scripts/deploy.js --network localhost
```

Finally, we can run the frontend with:

```sh
cd frontend
yarn install
yarn run start
```

Open [http://localhost:3000/](http://localhost:3000/) to see your Dapp. You will need to have [Metamask](https://metamask.io) installed and listening to `localhost 8545`.

## User Guide

You can find detailed instructions on using this repository and many tips in [its documentation](https://hardhat.org/tutorial).

For a complete introduction to Hardhat, refer to [this guide](https://hardhat.org/getting-started/#overview).

## What’s Included?

Your environment will have everything you need to build a Dapp powered by Hardhat and React.

- [Hardhat](https://hardhat.org/): An Ethereum development task runner and testing network.
- [ethers.js](https://docs.ethers.io/ethers.js/html/): A JavaScript library for interacting with Ethereum.
- [A sample frontend/Dapp](./frontend): A Dapp which uses [Create React App](https://github.com/facebook/create-react-app).

### For testing
- [Mocha](https://mochajs.org/): A JavaScript test runner.
- [Chai](https://www.chaijs.com/): A JavaScript assertion library.
- [Waffle](https://github.com/EthWorks/Waffle/): To have Ethereum-specific Chai assertions/mathers.

**Happy _buidling_!**
