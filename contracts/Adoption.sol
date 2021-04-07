// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Adoption {
    address[16] public adopters;

    // getter
    function getAdopters() public returns (address[16] memory) {
        return adopters;
    }

    // main function for each pet we want to save an address
    function adopt(uint256 petId) public returns (uint256) {
        require(petId >= 0 && petId <= 15);
        adopters[petId] = msg.sender;
        return petId;
    }
}
