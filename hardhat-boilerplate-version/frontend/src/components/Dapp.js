import React from "react";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
// TODO: specific to this example
import FlemVotesArtifact from "../contracts/FlemVotes.json";
import contractAddressFlemVotes from "../contracts/contract-address-flemvotes.json";
import contractAddressVoting from "../contracts/contract-address-voting.json";
import VotingLogicArtifact from "../contracts/Voting.json";

// All the logic of this dapp is contained in this Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.
import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
// TODO: specific to this example
import { MintNFT } from "./MintNFT";
import { AwardReputationForm } from "./AwardReputationForm";
import { BurnTokenForm } from "./BurnTokenForm";
import { MakeTopicForm } from "./MakeTopicForm";
import { LoadTopicForm } from "./LoadTopicForm";

// This is the Hardhat Network id, you might change it in the hardhat.config.js
// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
const HARDHAT_NETWORK_ID = "31337";
// const GOERLI_NETWORK_ID = '5'

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

// This component is in charge of doing these things:
//   1. Connects to the user's wallet
//   2. Read from the contract - shows the FlemVotes's name and symbol, and the FlemVotes the user owns
//   3. Write to the contract - mint FlemVotes by sending transactions
export class Dapp extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      // The info of the nft (i.e. It's name and symbol)
      // TODO: specific to this example
      nftData: undefined,
      userNFTs: [],
      // The user's address
      selectedAddress: undefined,
      // The ID about transactions being sent, and any possible error with them
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
    };

    this.state = this.initialState;
  }

  render() {
    // MetaMask injects the window.ethereum object. If it hasn't been
    // injected, we instruct the user to install MetaMask.
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    // The next thing we need to do is to ask the user to connect their wallet.
    // When the wallet gets connected, we are going to save the users's address
    // in the component's state. So if it hasn't been saved yet, we have
    // to show the ConnectWallet component.
    // Note that we pass it a callback that is going to be called when the user
    // clicks a button. This callback just calls the _connectWallet method.
    if (!this.state.selectedAddress) {
      return (
        <ConnectWallet
          connectWallet={() => this._connectWallet()}
          networkError={this.state.networkError}
          dismiss={() => this._dismissNetworkError()}
        />
      );
    }

    // If the nft data hasn't loaded yet, we show a loading component.
    if (!this.state.nftData) {
      return <Loading />;
    }

    // If everything is loaded, we render the application.
    return (
      <div className="container p-4">
        <div className="row">
          <div className="col-12">
            <h1>
              {this.state.nftData.name} ({this.state.nftData.symbol})
            </h1>
            <p>
              Welcome <b>{this.state.selectedAddress}</b>, you have{" "}
              <b>
                {this.state.userNFTs.length} {this.state.nftData.symbol}
              </b>
              .
            </p>
            {/* ez: commented out stuff with specific token IDs */}
            {/* <table>
              <thead>
                <tr>
                  <th>Token ID</th>
                </tr>
              </thead>
              <tbody>
                {this.state.userNFTs.map((nft, index) => (
                  <tr key={index}>
                    <td>{nft.tokenId.toString()}</td>
                  </tr>
                ))}
              </tbody>
            </table> */}
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-12">
            {/* 
              Sending a transaction isn't an immidiate action. You have to wait
              for it to be mined.
              If we are waiting for one, we show a message here.
            */}
            {this.state.txBeingSent && (
              <WaitingForTransactionMessage txHash={this.state.txBeingSent} />
            )}

            {/* 
              Sending a transaction can fail in multiple ways. 
              If that happened, we show a message here.
            */}
            {this.state.transactionError && (
              <TransactionErrorMessage
                message={this._getRpcErrorMessage(this.state.transactionError)}
                dismiss={() => this._dismissTransactionError()}
              />
            )}
          </div>
        </div>

        {this.state.nftData.owner.toLowerCase() ===
          this.state.selectedAddress && (
          <div className="row">
            <div className="col-12">
              {/*
                This component displays a form that the user can use to send a 
                transaction and mint some NTFs.
                The component doesn't have logic, it just calls the _mintNFT callback.
              */}
              {/* <MintNFT mintNFT={(to) => this._mintNFT(to)} /> */}
              <AwardReputationForm awardRep={(to) => this._awardRep(to)} />
              <BurnTokenForm burnTokens={(time) => this._burnTokens(time)} />
              <MakeTopicForm makeTopic={(prompt) => this._makeTopic(prompt)} />
              <LoadTopicForm pullPrompt={() => this._pullRecentPrompt()} />
            </div>
          </div>
        )}
      </div>
    );
  }

  async _connectWallet() {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // We check if the user connected to the networks where we deployed
    // our smart contract
    if (!this._checkNetwork()) {
      return;
    }

    // We reset the dapp state if the network is changed
    window.ethereum.on("chainChanged", ([networkId]) => {
      this._resetState();
    });

    // Connect to the user's account
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      this._handleAccountsChanged(accounts);
    } catch (err) {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log("Please connect to MetaMask.");
        this.setState({ networkError: "Please connect to MetaMask." });
      } else {
        console.error(err);
        this.setState({ networkError: err });
      }
    }

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", (accounts) => {
      this._handleAccountsChanged(accounts);
    });
  }

  // This method checks if Metamask selected network is Localhost:8545
  _checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      // TODO: if you deploy your contract to Goerli, use the following line
      // if (window.ethereum.networkVersion === GOERLI_NETWORK_ID) {
      return true;
    }

    this.setState({
      networkError: "Please connect Metamask to Localhost:8545",
    });

    return false;
  }

  _handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      this.setState({ networkError: "Please connect to MetaMask." });
    } else {
      this._initialize(accounts[0]);
    }
  }

  _initialize(userAddress) {
    // This method initializes the dapp

    this.setState({
      selectedAddress: userAddress,
    });

    this._intializeEthers();

    // TODO: specific to this example
    this._getNFTData();
    this._getUserNFTs();
  }

  async _intializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum.
    // A Provider abstracts a connection to the Ethereum blockchain,
    // for issuing queries and sending signed state changing transactions.
    // More about providers: https://docs.ethers.io/v4/api-providers.html
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    // A Contract is an abstraction of code that has been deployed to the blockchain.
    // More about contract: https://docs.ethers.io/v5/api/contract/contract/.
    // We initialize the contract using the provider and FlemVotes's
    // artifact. You can do this same thing with your contracts.
    // TODO: use your own contract artifact
    this._nft = new ethers.Contract(
      contractAddressFlemVotes.FlemVotes,
      FlemVotesArtifact.abi,
      this._provider.getSigner(0)
    );
    this._votingLogic = new ethers.Contract(
      contractAddressVoting.Voting,
      VotingLogicArtifact.abi,
      this._provider.getSigner(0)
    );

    // _mint emits a event "Transfer(from, to, tokenId)"
    // This is how to listen to an event
    // TODO: specific to this example
    this._nft.on("Transfer", (from, to, tokenId) => {
      console.log("Transfer token", from, to, tokenId.toString());
      this._getUserNFTs();
    });
  }

  // The next two methods just read from the contract and store the results
  // in the component state.
  // TODO: specific to this example
  async _getNFTData() {
    const name = await this._nft.name();
    const symbol = await this._nft.symbol();
    const owner = await this._nft.owner();

    this.setState({ nftData: { name, symbol, owner } });
  }

  // TODO: specific to this example
  async _getUserNFTs() {
    const nfts = [];
    const balance = await this._nft.balanceOf(this.state.selectedAddress);
    for (let index = 0; index < balance; index++) {
      const tokenId = await this._nft.tokenOfOwnerByIndex(
        this.state.selectedAddress,
        index
      );
      nfts.push({ tokenId });
    }

    this.setState({ userNFTs: [...nfts] });
  }

  // TODO: specific to this example
  async _mintNFT(to) {
    this._sendTransaction(this._nft.safeMint, [to]);
  }

  async _awardRep(to) {
    this._sendTransaction(this._nft.awardReputation, [to]);
  }

  async _burnTokens(time) {
    this._sendTransaction(this._nft._expireTokens, [20]);
    console.log("sent transaction _burnTokens");
  }

  async _makeTopic(prompt) {
    this._sendTransaction(this._votingLogic.createTopic, [
      prompt,
      ["yes", "no"],
      5,
      10,
    ]);
    console.log("transaction sent: createTopic to Voting");
  }

  async _pullRecentPrompt() {
    let sendPromise = this._sendTransaction(
      this._votingLogic.getRecentTopicPrompt,
      []
    );
    console.log("pulled the most recent prompt from contract");
    sendPromise.then((this._votingLogic.getRecentTopicPrompt, []) => {
      console.log(this._votingLogic.getRecentTopicPrompt());
      // {
      //    // All transaction fields will be present
      //    "nonce", "gasLimit", "pasPrice", "to", "value", "data",
      //    "from", "hash", "r", "s", "v"
      // }
    });
  }
  // This method sends an ethereum transaction to mint FlemVotes.
  // While this action is specific to this application, it illustrates how to
  // send a transaction.
  async _sendTransaction(method, args) {
    // Sending a transaction is a complex operation:
    //   - The user can reject it
    //   - It can fail before reaching the ethereum network (i.e. if the user
    //     doesn't have ETH for paying for the tx's gas)
    //   - It has to be mined, so it isn't immediately confirmed.
    //     Note that some testing networks, like Hardhat Network, do mine
    //     transactions immediately, but your dapp should be prepared for
    //     other networks.
    //   - It can fail once mined.
    //
    // This method handles all of those things, so keep reading to learn how to
    // do it.

    try {
      // If a transaction fails, we save that error in the component's state.
      // We only save one such error, so before sending a second transaction, we
      // clear it.
      this._dismissTransactionError();

      // We send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.
      // TODO: specific to this example
      const tx = await method.apply(null, args);
      this.setState({ txBeingSent: tx.hash });

      // We use .wait() to wait for the transaction to be mined. This method
      // returns the transaction's receipt.
      const receipt = await tx.wait();

      // The receipt, contains a status flag, which is 0 to indicate an error.
      if (receipt.status === 0) {
        // We can't know the exact error that made the transaction fail when it
        // was mined, so we throw this generic one.
        throw new Error("Transaction failed");
      }

      // If we got here, the transaction was successful, so you may want to
      // update your state.
      // TODO: update app state.
    } catch (error) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      // Other errors are logged and stored in the Dapp's state. This is used to
      // show them to the user, and for debugging.
      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      // If we leave the try/catch, we aren't sending a tx anymore, so we clear
      // this part of the state.
      this.setState({ txBeingSent: undefined });
    }
  }

  // This method just clears part of the state.
  _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

  // This method just clears part of the state.
  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  // This is an utility method that turns an RPC error into a human readable
  // message.
  _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  }

  // This method resets the state
  _resetState() {
    this.setState(this.initialState);
  }
}
