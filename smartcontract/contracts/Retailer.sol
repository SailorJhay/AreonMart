// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


contract Retailer {
    mapping(address => bool) public retailerAddresses;
    uint8 public retailerCount;

    event RetailerAdded(address retailer);

    constructor() {
        retailerAddresses[msg.sender] = true;
        retailerCount = 1;
    }

    function addRetailer(address _retailer) public {
        require(!retailerAddresses[_retailer], "Retailer already added");

        retailerAddresses[_retailer] = true;
        retailerCount++;

        emit RetailerAdded(_retailer);
    }

    function isRetailer(address _retailer) public view returns (bool) {
        return retailerAddresses[_retailer];
    }

    function getRetailerCount() public view returns (uint8) {
        return retailerCount;
    }

}