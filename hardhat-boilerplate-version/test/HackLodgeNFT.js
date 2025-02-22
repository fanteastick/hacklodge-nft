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
describe("FlemVotes contract", function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let FlemVotes;
  let nft;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    FlemVotes = await ethers.getContractFactory("FlemVotes");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call HackLodgeNFT.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    nft = await FlemVotes.deploy();

    // We can interact with the contract by calling `nft.method()`
    await nft.deployed();
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // Expect receives a value, and wraps it in an assertion objet. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      expect(await nft.owner()).to.equal(owner.address);
    });

    it("Should set the correct name and symbol", async function () {
      expect(await nft.name()).to.equal("FlemVotes");
      expect(await nft.symbol()).to.equal("FV");
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
