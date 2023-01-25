// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;
import "hardhat/console.sol";

contract WavePortal {
    uint totalWaves;

    constructor() {
        console.log("I'm fired up.");
    }

    function wave() public {
        totalWaves += 1;
        console.log("%s has Waved!", msg.sender);
    }

    function getTotalWaves() public view returns (uint) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
