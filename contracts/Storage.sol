// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Storage {
    uint256 public value;

    constructor(uint256 _value) {
        value = _value;
    }

    function setValue(uint256 _value) public {
        value = _value;
    }
}
