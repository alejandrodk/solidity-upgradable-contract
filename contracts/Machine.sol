// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Storage.sol";

contract Machine {
    Storage store;

    constructor(Storage addr) {
        store = addr;
    }

    function saveValue(uint value) public returns (bool) {
        store.setValue(value);
        return true;
    }

    function getValue() public view returns (uint) {
        return store.value();
    }
}
