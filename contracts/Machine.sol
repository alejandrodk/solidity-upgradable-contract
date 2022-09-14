// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Storage.sol";

contract Machine {
    uint256 public calculateResult;
    address public user;
    Storage store;

    event calledByCall(uint256 first, uint256 second, bool success);
    event calledByDelegateCall(uint256 first, uint256 second, bool success);

    constructor(Storage addr) {
        store = addr;
        calculateResult = 0;
    }

    function saveValue(uint value) public returns (bool) {
        store.setValue(value);
        return true;
    }

    function getValue() public view returns (uint) {
        return store.value();
    }

    function addWithCall(
        address calculator,
        uint256 first,
        uint256 second
    ) public returns (uint256) {
        (bool success, bytes memory result) = calculator.call(
            abi.encodeWithSignature("add(uint256,uint256)", first, second)
        );
        emit calledByCall(first, second, success);
        return abi.decode(result, (uint256));
    }

    function addWithDelegateCall(
        address calculator,
        uint256 first,
        uint256 second
    ) public returns (uint256) {
        (bool success, bytes memory result) = calculator.delegatecall(
            abi.encodeWithSignature("add(uint256,uint256)", first, second)
        );
        emit calledByDelegateCall(first, second, success);
        return abi.decode(result, (uint256));
    }
}
