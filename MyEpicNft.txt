// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// We first import some Openzeppelin Contracts
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

// We need to import the helper functions from the contract that we copy/pasted.
import {Base64} from "./libraries/Base64.sol";

// We inherit the contract we imported. This means we'll have access
// to the inherited contract's methods.

// ERC721 -> parent, MyEpicNft -> Child
contract MyEpicNft is ERC721 {
    // Magic given to us by OpenZeppelin to hepl us keep track of tokenIds
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // This is our SVG code. All we need to change is the word that's displayed. Everything else stays the same.
    // So, we make a baseSvg variable here that all our NFTs can use.
    string baseSvg =
        "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    // I create three arrays, each with their own theme of random words.
    // Pick some random funny words, names of anime characters, foods you like, whatever!
    string[] firstWords = [
        "Fantastic",
        "Epic",
        "Terrible",
        "Crazy",
        "Wild",
        "Angry"
    ];
    string[] secondWords = [
        "Cupcake",
        "Pizza",
        "Milkshake",
        "Curry",
        "Chiken",
        "Salad"
    ];
    string[] thirdWords = [
        "Naruto",
        "Sausuke",
        "Goku",
        "Shinchan",
        "Saitama",
        "Madara"
    ];

    // we need to pass the name of our NFTs token and its symbol.
    constructor() ERC721("SquareNFT", "SQUARE") {
        console.log("This is my Nft collection");
    }

    // I create a function to randomly pick a word from each array.
    function pickRandomFirstWord(
        uint256 tokenId
    ) public view returns (string memory) {
        // i seed the random generator.
        uint256 rand = random(
            string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId)))
        );
        // Squash the # between 0 and the length of the array to avoid going out of bounds.

        rand = rand % firstWords.length;
        return firstWords[rand];
    }

    function pickRandomSecondWord(
        uint256 tokenId
    ) public view returns (string memory) {
        uint256 rand = random(
            string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId)))
        );
        rand = rand % secondWords.length;
        return secondWords[rand];
    }

    function pickRandomThirdWord(
        uint tokenId
    ) public view returns (string memory) {
        uint rand = random(
            string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId)))
        );

        rand = rand % thirdWords.length;
        return thirdWords[rand];
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    //A function our user will hit to get their NFT.
    function makeAnEpicNFT() public {
        //Get the current tokenId, this strats at 0
        uint256 newItemId = _tokenIds.current();

        // We go and randomly grab one word from each of the three arrays.
        string memory first = pickRandomFirstWord(newItemId);
        string memory second = pickRandomSecondWord(newItemId);
        string memory third = pickRandomThirdWord(newItemId);

        string memory combinedWord = string(
            abi.encodePacked(first, second, third)
        );
        string memory finalSvg = string(
            abi.encodePacked(baseSvg, combinedWord, "</text></svg>")
        );

        // Get all json metadata in place and base64 encode it
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        // We set the title of our NFT as the generated word.
                        combinedWord,
                        '", "description": "A highly acclaimed collection of squares.", "image": "data:image/svg+xml;base64,',
                        // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        // Just like before, we prepend data:application/json;base64, to our data
        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        // We add data:image/svg+xml;base64 and then append our base64 encode our svg.

        // string memory finalTokenUri = string(
        //     abi.encodePacked("data:application/json;base64,", json)
        // );

        // console.log("\n--------------------");
        // console.log(finalSvg);
        // console.log("--------------------\n");
        // console.log(json);

        //Actually mint the NFT to the sender using msg.sender
        _safeMint(msg.sender, newItemId);

        //return the NFT's metadata
        tokenURI(newItemId, finalTokenUri);

        //Increment the counter for when the next NFT is minted.
        _tokenIds.increment();
        //No one can have a tokenIds that's already been minted too.
    }

    // set the NFT's metadata
    //set the NFTs unique identifier along with the data associated w/ that unique identifier. It's literally us setting the actual data that makes the NFT valuable
    function tokenURI(
        uint256 _tokenId,
        string memory _finalTokenUri
    ) public view overrides returns (string memory) {
        require(_exists(_tokenId));
        console.log(
            "An NFT with ID %s has been minted by %s",
            _tokenId,
            msg.sender
        );

        console.log("finalTokenUri:", _finalTokenUri);

        return string(_finalTokenUri);
    }
}

//The 'tokenURI' is where the actual NFT data lives. And it usually links to a 'JSON file' called the 'metadata' that looks something like this:

// {
//     "name": "Spongebob Cowboy Pants",
//     "description": "A silent hero. A watchful protector.",
//     "image": "https://i.imgur.com/v7U019j.png"
// }
// You can customize this, but, almost every NFT has a name, description, and a link to something like a video, image, etc. It can even have custom attributes on it! Be careful with the structure of your metadata, if your structure does not match the OpenSea Requirements your NFT will appear broken on the website.

// return "https://www.jsonkeeper.com/b/1V7K";
// return
//     string(
//         abi.encodePacked(
//             "data:application/json;base64,",
//             "ewogICAgIm5hbWUiOiAiRXBpY0xvcmRIYW1idXJnZXIiLAogICAgImRlc2NyaXB0aW9uIjogIkFuIE5GVCBmcm9tIHRoZSBoaWdobHkgYWNjbGFpbWVkIHNxdWFyZSBjb2xsZWN0aW9uIiwKICAgICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SW5oTmFXNVpUV2x1SUcxbFpYUWlJSFpwWlhkQ2IzZzlJakFnTUNBek5UQWdNelV3SWo0TkNpQWdJQ0E4YzNSNWJHVStMbUpoYzJVZ2V5Qm1hV3hzT2lCM2FHbDBaVHNnWm05dWRDMW1ZVzFwYkhrNklITmxjbWxtT3lCbWIyNTBMWE5wZW1VNklERTBjSGc3SUgwOEwzTjBlV3hsUGcwS0lDQWdJRHh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGcwS0lDQWdJRHgwWlhoMElIZzlJalV3SlNJZ2VUMGlOVEFsSWlCamJHRnpjejBpWW1GelpTSWdaRzl0YVc1aGJuUXRZbUZ6Wld4cGJtVTlJbTFwWkdSc1pTSWdkR1Y0ZEMxaGJtTm9iM0k5SW0xcFpHUnNaU0krUlhCcFkweHZjbVJJWVcxaWRYSm5aWEk4TDNSbGVIUStEUW84TDNOMlp6ND0iCn0="
//         )
//     );
