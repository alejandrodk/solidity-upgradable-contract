// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Calculator {
    uint256 public calculateResult;
    address public user;

    event Added(uint256 first, uint256 second);

    function add(uint256 first, uint256 second) public returns (uint256) {
        calculateResult = first + second;
        assert(calculateResult >= first);

        emit Added(first, second);
        user = msg.sender;

        return calculateResult;
    }
}