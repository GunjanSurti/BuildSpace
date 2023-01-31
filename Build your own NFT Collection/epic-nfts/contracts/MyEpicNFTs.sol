// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// We first import some Openzeppelin Contracts
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

// We inherit the contract we imported. This means we'll have access
// to the inherited contract's methods.

// ERC721 -> parent, MyEpicNft -> Child
contract MyEpicNft is ERC721 {
    // Magic given to us by OpenZeppelin to hepl us keep track of tokenIds
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // we need to pass the name of our NFTs token and its symbol.
    constructor() ERC721("SquareNFT", "SQUARE") {
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
        //No one can have a tokenIds that's already been minted too.
    }

    // set the NFT's metadata
    //set the NFTs unique identifier along with the data associated w/ that unique identifier. It's literally us setting the actual data that makes the NFT valuable
    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        require(_exists(_tokenId));
        console.log(
            "An NFT with ID %s has been minted by %s",
            _tokenId,
            msg.sender
        );
        // return "https://www.jsonkeeper.com/b/1V7K";
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    "ewogICAgIm5hbWUiOiAiRXBpY0xvcmRIYW1idXJnZXIiLAogICAgImRlc2NyaXB0aW9uIjogIkFuIE5GVCBmcm9tIHRoZSBoaWdobHkgYWNjbGFpbWVkIHNxdWFyZSBjb2xsZWN0aW9uIiwKICAgICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SW5oTmFXNVpUV2x1SUcxbFpYUWlJSFpwWlhkQ2IzZzlJakFnTUNBek5UQWdNelV3SWo0TkNpQWdJQ0E4YzNSNWJHVStMbUpoYzJVZ2V5Qm1hV3hzT2lCM2FHbDBaVHNnWm05dWRDMW1ZVzFwYkhrNklITmxjbWxtT3lCbWIyNTBMWE5wZW1VNklERTBjSGc3SUgwOEwzTjBlV3hsUGcwS0lDQWdJRHh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGcwS0lDQWdJRHgwWlhoMElIZzlJalV3SlNJZ2VUMGlOVEFsSWlCamJHRnpjejBpWW1GelpTSWdaRzl0YVc1aGJuUXRZbUZ6Wld4cGJtVTlJbTFwWkdSc1pTSWdkR1Y0ZEMxaGJtTm9iM0k5SW0xcFpHUnNaU0krUlhCcFkweHZjbVJJWVcxaWRYSm5aWEk4TDNSbGVIUStEUW84TDNOMlp6ND0iCn0="
                )
            );
    }
}

//The 'tokenURI' is where the actual NFT data lives. And it usually links to a 'JSON file' called the 'metadata' that looks something like this:

// {
//     "name": "Spongebob Cowboy Pants",
//     "description": "A silent hero. A watchful protector.",
//     "image": "https://i.imgur.com/v7U019j.png"
// }
// You can customize this, but, almost every NFT has a name, description, and a link to something like a video, image, etc. It can even have custom attributes on it! Be careful with the structure of your metadata, if your structure does not match the OpenSea Requirements your NFT will appear broken on the website.
