//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Domains {
    mapping(string => address) public domains;
    mapping(string => string) public records;
    mapping(string => bool) public isWebsiteRegistered;

    constructor() {
        console.log("THIS IS MY DOMAINS CONTRACT. NICE.");
    }

    function register(string calldata name) public {
        require(
            domains[name] == address(0),
            "Oops! This domain is already registered."
        );
        domains[name] = msg.sender;
        console.log("%s has registered a domain!", msg.sender);
    }

    function getAddress(string calldata name) public view returns (address) {
        return domains[name];
    }

    function setRecord(string calldata name, string calldata website) public {
        require(
            domains[name] == msg.sender,
            "Oops! You do not have access to this function."
        );
        require(
            !isWebsiteRegistered[website],
            "Oops! This website is already in use."
        );
        records[name] = website;
        isWebsiteRegistered[website] = true;
        console.log("Website is mapped here:%s", website);
    }

    function getRecord(string calldata name)
        public
        view
        returns (string memory)
    {
        return records[name];
    }
}
