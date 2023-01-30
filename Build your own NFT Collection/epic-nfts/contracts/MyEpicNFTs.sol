// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

// We first import some Openzeppelin Contracts
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";
.
// We inherit the contract we imported. This means we'll have access
// to the inherited contract's methods.

// ERC721 -> parent, MyEpicNft -> Child
contract MyEpicNft is ERC721 {
    // Magic given to us by OpenZeppelin to hepl us keep track of tokenIds
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // we need to pass the name of our NFTs token and its symbol.
    constructor() ERC721 ("SquareNFT", "SQUARE") {
        console.log("This is my Nft collection");
    }

    //A function our user will hit to get their NFT.
    function makeAnEpicNFT() public {
        //Get the current tokenId, this strats at 0
        uint256 newItemId = _tokenIds.current();

        //Actually mint the NFT to the sender using msg.sender
        _safeMint(msg.sender, newItemId);

        //return the NFT's metadata
        tokenURI(newItemId);

        //Increment the counter for when the next NFT is minted.
        _tokenIds.increment();

        // set the NFT's metadata
        function tokenURI(uint256 _tokenId) public view override returns (string memory) {
            require(_exists(_tokenId));
            return "blah";
        }
    }

}
