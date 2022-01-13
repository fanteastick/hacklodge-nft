// This is an exmaple test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` recieves the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("Voting contract", function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let Voting;
  let nft;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Voting = await ethers.getContractFactory("Voting");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call HackLodgeNFT.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    nft = await Voting.deploy();

    // We can interact with the contract by calling `nft.method()`
    await nft.deployed();
  });

  describe("pullPrevPrompt", function () {
    it("Should make two prompts and return the second one", async function () {
      const prompt1 = "prompt 1";
      const prompt2 = "prompt 2";
      await nft.createTopic(prompt1, ["yes", "no"], 5, 10);
      await nft.createTopic(prompt2, ["yes", "no"], 5, 10);
      console.log("prompt time");
      expect((await nft.getRecentTopicPrompt()) === prompt2);
    });
  });

  // describe("mintItem", function () {
  //   it("Should be able to mint item", async function () {
  //     const tokenUri = "https://myproject.com/token_uri";
  //     await nft.mintItem(addr1.address, tokenUri);
  //     expect(await nft.ownerOf(1)).to.equal(addr1.address);
  //     expect(await nft.tokenURI(1)).to.equal(tokenUri);
  //   });
  // });
});
