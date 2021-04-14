# Celo-Tutorial

# How to create a erc1155 contract and connect a Celo wallet in your app
We'll write a smart contract using solidity language and library erc1155 of Openzeppelin,using nodejs with Hardhat we will compile code of smart contract and test the contract before deploy,after deploying the contract we will create a custom task with Hardhat to create a Celo account and deploy the contract in Celo network using datahub,lastly, we are going to create a react app that will connect to celo wallet account and interact with the smart contract

# Prerequisite 
 - have Node Js installed
 - basic know about javascript , solidity and react

# Install and use Hardhat
Hardhat is a development environment that compile, deploy, test, and debug your Ethereum software,can also be used to deploy Celo's smart contract 

#### We'll install all node modules necessary to run hardhat
```bash
npm install --save-dev hardhat
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers web3 @celo/contractkit
```

#### Now run the hardhat to create a new project, chose "Create a sample project"
```bash
npx hardhat
```
```bash
888    888                      888 888               888
888    888                      888 888               888
888    888                      888 888               888
8888888888  8888b.  888d888 .d88888 88888b.   8888b.  888888
888    888     "88b 888P"  d88" 888 888 "88b     "88b 888
888    888 .d888888 888    888  888 888  888 .d888888 888
888    888 888  888 888    Y88b 888 888  888 888  888 Y88b.
888    888 "Y888888 888     "Y88888 888  888 "Y888888  "Y888

Welcome to Hardhat v2.1.2

? What do you want to do? ...
> Create a sample project
  Create an empty hardhat.config.js
  Quit
```

# Write a smart contract using erc1155 library
RC1155 is a novel token standard that aims to take the best from previous standards to create a fungibility-agnostic and gas-efficient token contract.
ERC1155 draws ideas from all of ERC20, ERC721, and ERC777.

#### we'll need to install the Openzeppelin contract to have the necessary libraries for our contract
 ```bash
npm install @openzeppelin/contracts
```

#### create the file contracts/TinyVillage.sol
#### lets we'll write our contract using solidity
#### choose the compile version and the license
 ```solidity
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
```
#### import the necessary libraries 
 ```solidity
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
```
#### now create the contract
 ```solidity
contract TinyVillage  is ERC1155 {

}
```
#### inside the contract create the id to ours tokens
 ```solidity
 uint256 public constant VILLAGE = 0;
 uint256 public constant MINE = 1;
 uint256 public constant FARM = 2;
 uint256 public constant MILL = 3;
 uint256 public constant CASTLE = 4;
```
#### added the constructor, insert the URL that contains the JSON that have information about our tokens
 ```solidity
constructor() ERC1155("https://gateway.pinata.cloud/ipfs/QmTN32qBKYqnyvatqfnU8ra6cYUGNxpYziSddCatEmopLR/metadata/api/item/{id}.json") {
   }
```
#### when the app looking for a token it will replace the {id} for a token id,example the json 1 of the mine
```
 https://gateway.pinata.cloud/ipfs/QmTN32qBKYqnyvatqfnU8ra6cYUGNxpYziSddCatEmopLR/metadata/api/item/1.json
```
#### added the constructor, insert the URL that contains the JSON that have information about our tokens
 ```solidity
constructor() ERC1155("https://gateway.pinata.cloud/ipfs/QmTN32qBKYqnyvatqfnU8ra6cYUGNxpYziSddCatEmopLR/metadata/api/item/{id}.json") {
   }
```
#### this is json who will return when looking for 1.json, he has basic information about our tokens, such as name, description and address of his image 
```json
{
  "name": "Mine",
  "description": "Mine inseda a tiny mount",
  "image": "https://gateway.pinata.cloud/ipfs/QmPoFKTD8U2Mg6kgMheyv9K4rtPRnKv78orRHjaYaTVqNm/images/mine.png"
}
```
#### our smart contract let you mint an NFT in specific conditions
 ```solidity
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
```
#### this is the entire TinyVillage.sol contract
 ```solidity
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
   }
```
# Compile the contract using hardhat
