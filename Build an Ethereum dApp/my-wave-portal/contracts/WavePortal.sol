// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;
import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    /* We will be using this below to help generate a random number */

    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver; // the address of the user who waved
        string message; // the message the user sent
        uint256 timestamp; // the timestamp when the user waved
    }
    /*
     * I declare a variable "waves" that lets me store an array of structs.
     * This is what lets me hold all the waves anyone ever sends to me!
     */
    Wave[] waves;
    /*
     * This is an address => uint mapping, meaning I can associate an address with a number!
     * In this case, I'll be storing the address with the "last time" the user waved at us.
     */
    mapping(address => uint256) public lastWavesAt;

    //payable allows contract to pay.
    constructor() payable {
        console.log("I'm fired up.");
        /**
         * set the initial seed in constructor
         */
        seed = (block.timestamp + block.difficulty) % 100;
    }

    /*
     * You'll notice I changed the wave function a little here as well and
     * now it requires a string called _message. This is the message our user
     * sends us from the frontend!
     */
    // %d or %s => format specifier
    function wave(string memory _message) public {
        /*
         * We need to make sure the current timestamp is at least 15-minutes bigger than the last timestamp we stored
         */
        require(
            lastWavesAt[msg.sender] + 30 seconds < block.timestamp,
            "Must wait 30 seconds before waving again."
        );
        /**
         * update the current timpstamp we have for the user
         */
        lastWavesAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s waved! with message: %s ", msg.sender, _message);

        /* this is where we actually store the wave data in array */
        waves.push(Wave(msg.sender, _message, block.timestamp));

        /**
         * Generate a new seed for the next user that sends a wave
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;

        console.log("Random # generated: %d", seed);

        /**
         * Give a 50% chance that the user wins the prize.
         */
        if (seed <= 50) {
            console.log("%s won!", msg.sender);
            /**
             * The same code we had before to send the Prize.
             */
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw money more than th contract has!"
            );
            (bool success, ) = msg.sender.call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract");
        }

        /**
         * we added some fanciness here
         */
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}

// address(this).balance => is the balance of contract
//(msg.sender).call{value: prizeAmount}("") is the magic line where we send money

/** added a function getAllWaves which will return the struct array, waves to us.
 * this will make it easy to retrive the waves from our website!
 */
