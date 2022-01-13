// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract FlemVotes is
    ERC721,
    ERC721Enumerable,
    Pausable,
    Ownable,
    ERC721Burnable
{
    using Counters for Counters.Counter;

    // Token timestamp
    uint256 private _timestamp; // ez: later switch to Token objects

    // Mapping from token ID to timestamps
    mapping(uint256 => uint256) private _timestamps;
    uint256 private _zerothTokenId = 0;
    uint256 private _highestId = 0;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("FlemVotes", "FV") {} //ez: makes the collection

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _timestamps[tokenId] = block.timestamp;
        // ez: above sets the timestamp, uses UNIX timestamp in seconds since epoch
        _highestId++;
    }

    // ez: on deploy, call pause to prevent transfers of the tokens
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function expireTokens() public onlyOwner {
        uint256 tendays = 864000;
        _expireTokens(tendays);
    }

    function _expireTokens(uint256 timeElapsed) public onlyOwner {
        // ez: burns ALL the tokens that have a timestamp greater than 10 days ago
        // ez: prolly very inefficient XD
        uint256 currId = _zerothTokenId;
        uint256 thresholdTimestamp = block.timestamp - timeElapsed;
        // uint256 thresholdTimestamp = now - timeElapsed;
        uint256 timestamp = _timestamps[currId];
        while (timestamp < thresholdTimestamp && currId <= _highestId - 1) {
            _burn(currId);
            currId++;
            timestamp = _timestamps[currId];
            console.log("burned token at id: ");
            console.log(currId);
        }
        _zerothTokenId = currId;
    }

    function awardReputation(address to) public onlyOwner {
        // ez: lol it just awards 10 reputation
        _awardReputation(to, 10);
    }

    function _awardReputation(address to, uint256 amount) public onlyOwner {
        require(amount <= 30, "Reputation amount is too high xd");
        for (uint256 i = 0; i < amount; i++) {
            safeMint(to);
        }
    }

    function isOwner(address owner) public view returns (bool) {
        if (balanceOf(owner) > 0) {
            return true;
        }
        return false;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // Functions for eilleen for testing:
    function getTimestamp(uint256 tokenId) public view returns (uint256) {
        return (_timestamps[tokenId]);
    }

    // ez: 721 already has function ownerOf
}
