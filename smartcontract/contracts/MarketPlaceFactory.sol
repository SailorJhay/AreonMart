// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./MarketPlace.sol";

contract MarketPlaceFactory{

    MarketPlace[] public marketPlaces;
    
    function createMarketPlace(string memory _name, string memory _description) public returns (address) {
        MarketPlace marketPlace = new MarketPlace(_name, _description);
        marketPlaces.push(marketPlace);
        return address(marketPlace);
    }
}
