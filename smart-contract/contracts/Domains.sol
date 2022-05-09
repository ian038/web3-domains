//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {StringUtils} from "./libraries/StringUtils.sol";
import "hardhat/console.sol";

contract Domains {
    string public tld;

    mapping(string => address) public domains;
    mapping(string => string) public records;
    mapping(string => bool) public isWebsiteRegistered;

    constructor(string memory _tld) payable {
        tld = _tld;
        console.log("%s name service deployed", _tld);
    }

    function price(string calldata name) public pure returns (uint256) {
        uint256 len = StringUtils.strlen(name);
        require(len > 0);
        if (len == 3) {
            return 5 * 10**17; // 5 MATIC = 5 000 000 000 000 000 000 (18 decimals). We're going with 0.5 Matic cause the faucets don't give a lot
        } else if (len == 4) {
            return 3 * 10**17; // To charge smaller amounts, reduce the decimals. This is 0.3
        } else {
            return 1 * 10**17;
        }
    }

    function register(string calldata name) public payable {
        require(
            domains[name] == address(0),
            "Oops! This domain is already registered."
        );
        uint256 _price = price(name);
        require(msg.value >= _price, "Not enough Matic paid");

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
