// This is a script for deploying your contracts. You can adapt it to deploy

const { ethers } = require("hardhat");

// yours, or create new ones.
async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is avaialble in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const FlemVotes = await ethers.getContractFactory("FlemVotes");
  const nft = await FlemVotes.deploy();
  await nft.deployed();

  console.log("FlemVotes contract address:", nft.address);

  const Voting = await ethers.getContractFactory("Voting");
  const votingLogic = await Voting.deploy();
  await votingLogic.deployed();
  console.log("Voting contract address:", votingLogic.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(nft, votingLogic);
}

function saveFrontendFiles(nft, votingLogic) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address-flemvotes.json",
    JSON.stringify({ FlemVotes: nft.address }, undefined, 2)
  );

  const FlemVotesArtifact = artifacts.readArtifactSync("FlemVotes");

  fs.writeFileSync(
    contractsDir + "/FlemVotes.json",
    JSON.stringify(FlemVotesArtifact, null, 2)
  );

  // part twoooooo

  fs.writeFileSync(
    contractsDir + "/contract-address-voting.json",
    JSON.stringify({ Voting: votingLogic.address }, undefined, 2)
  );

  const VotingLogicArtifact = artifacts.readArtifactSync("Voting");

  fs.writeFileSync(
    contractsDir + "/Voting.json",
    JSON.stringify(VotingLogicArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
