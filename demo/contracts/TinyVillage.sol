//SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract TinyVillage  is ERC1155 {
    uint256 public constant VILLAGE = 0;
    uint256 public constant MINE = 1;
    uint256 public constant FARM = 2;
    uint256 public constant MILL = 3;
    uint256 public constant CASTLE = 4;

    constructor() ERC1155("https://gateway.pinata.cloud/ipfs/QmTN32qBKYqnyvatqfnU8ra6cYUGNxpYziSddCatEmopLR/metadata/api/item/{id}.json") {
    }
    
    //If you do not have any village the contract will let you buy one
    function mintVillage() public{
        require(balanceOf(msg.sender,VILLAGE) == 0,"you already have a Village ");
        _mint(msg.sender,VILLAGE,1,"0x000");
    }
    
    //If you do not have any Mine and have Village the contract will let you buy the Mine
    function mintMine() public{
        require(balanceOf(msg.sender,VILLAGE) > 0,"you need have a Village");
        require(balanceOf(msg.sender,MINE) == 0,"you already have a Mine");
        _mint(msg.sender,MINE,1,"0x000");
    }
    
    //If you do not have any Farm and have Village the contract will let you buy the Farm
    function mintFarm() public{
        require(balanceOf(msg.sender,VILLAGE) > 0,"you need have a Village");
        require(balanceOf(msg.sender,FARM) == 0,"you already have a Farm");
        _mint(msg.sender,FARM,1,"0x000");
    }
    
    //If you do not have any Mill and have Village and Farm the contract will let you buy the Mill
    function mintMill() public{
        require(balanceOf(msg.sender,VILLAGE) > 0,"you need have a Village");
        require(balanceOf(msg.sender,FARM) > 0,"you need have a Farm");
        require(balanceOf(msg.sender,MILL) == 0,"you already have a Mill");
        _mint(msg.sender,MILL,1,"0x000");
    }
    
    //If you do not have any Castle and have all others NFt the contract will let you buy the Mill
    function mintCastle() public{
        require(balanceOf(msg.sender,MINE) > 0,"you need have a Mine");
        require(balanceOf(msg.sender,MILL) > 0,"you need have a Mill");
        require(balanceOf(msg.sender,CASTLE) == 0,"you already have a Castle");
        _mint(msg.sender,CASTLE,1,"0x000");
    }
}