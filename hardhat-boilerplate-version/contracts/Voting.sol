// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0 <0.9.0;
import "hardhat/console.sol";

contract Voting {
    enum State {
        BeforeStart,
        Running,
        Completed,
        Canceled
    }
    struct Topic {
        string prompt;
        string[] options;
        address proposer;
        State state;
        uint256 startline;
        uint256 deadline;
        address[] voters;
        mapping(address => string) votes;
        mapping(string => uint256) tallies;
    }

    mapping(uint256 => Topic) public topics;
    uint256 public nextTopicNumber;

    constructor() {
        nextTopicNumber = 0;
    }

    function setState(uint256 topic_id) private {
        require(
            topic_id < nextTopicNumber + 1,
            "setState: Invalid topic id passed in"
        );
        Topic storage topic = topics[topic_id];
        if (topic.state == State.Canceled) {
            return;
        }
        if (block.timestamp < topic.startline) {
            topic.state = State.BeforeStart;
        } else if (
            block.timestamp >= topic.startline &&
            block.timestamp < topic.deadline
        ) {
            topic.state = State.Running;
        } else {
            topic.state = State.Completed;
        }
    }

    function createTopic(
        string memory _prompt,
        string[] memory _options,
        uint256 _startline,
        uint256 _deadline
    ) public {
        require(
            _startline < _deadline,
            "Deadline cannot be before voting period starts!"
        );
        Topic storage topic = topics[nextTopicNumber];
        topic.prompt = _prompt;
        topic.options = _options;
        topic.proposer = msg.sender;
        topic.startline = _startline;
        topic.deadline = _deadline;
        setState(nextTopicNumber);
        nextTopicNumber++;
        console.log("topic created w prompt: ");
        console.log(topic.prompt);
    }

    function vote(uint256 topic_id, string memory option)
        public
        returns (bool)
    {
        require(topic_id < nextTopicNumber, "vote: Invalid topic id passed in");
        Topic storage topic = topics[topic_id];
        if (block.timestamp > topic.deadline) {
            topic.state = State.Completed;
        }
        require(topic.state == State.Running, "Vote must be currently running");
        // also need to check address is member of DAO
        // make sure caller hasn't already voted
        require(
            keccak256(abi.encodePacked(topic.votes[msg.sender])) ==
                keccak256(abi.encodePacked(""))
        );
        topic.votes[msg.sender] = option;
        topic.voters.push(msg.sender);
        topic.tallies[option] += 1;

        return true;
    }

    function getWinningOption(uint256 topic_id)
        private
        returns (string memory)
    {
        require(
            topic_id < nextTopicNumber,
            "getWinningOption: Invalid topic id passed in"
        );
        Topic storage topic = topics[topic_id];
        setState(topic_id);
        require(topic.state == State.Completed, "Voting is not complete");
        string memory winner = "";
        uint256 winnerNoOfVotes = 0;
        for (uint256 i = 0; i < topic.options.length; i++) {
            string memory currentOption = topic.options[i];
            if (topic.tallies[currentOption] > winnerNoOfVotes) {
                winner = currentOption;
                winnerNoOfVotes = topic.tallies[currentOption];
            }
        }

        return winner;
    }

    function distributeReputation(uint256 topic_id) public returns (bool) {
        string memory winner = getWinningOption(topic_id);
        bytes32 hashedWinner = keccak256(abi.encodePacked(winner));
        Topic storage topic = topics[topic_id];
        for (uint256 i = 0; i < topic.voters.length; i++) {
            address currentVoter = topic.voters[i];
            bytes32 hashedVote = keccak256(
                abi.encodePacked(topic.votes[currentVoter])
            );
            if (hashedWinner == hashedVote) {
                // add reputation to currentVoter
            }
        }
        return true;
    }

    /// functions for pulling information for frontend testing:
    function getRecentTopicPrompt()
        public
        view
        virtual
        returns (string memory)
    {
        uint256 topic_id = nextTopicNumber;
        Topic storage topic = topics[topic_id];
        return topic.prompt;
    }

    function getTopicPrompt(uint256 topicId)
        public
        view
        virtual
        returns (string memory)
    {
        uint256 topic_id = topicId;
        Topic storage topic = topics[topic_id];
        return topic.prompt;
    }
}
