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
## Compile the contract using hardhat
#### now delete the default hardhat contract in contracts/Greeter.sol,go to hardhat.config.js and update the solidity version 
 ```javascript
module.exports = {
  solidity: "0.8.0",
};
```
#### run npx hardhat compile
 ```bash
 npx hardhat compile
 Solidity 0.8.0 is not fully supported yet. You can still use Hardhat, but some features, like stack traces, might not work correctly.

Learn more at https://hardhat.org/reference/solidity-support"

 Compiling 9 files with 0.8.0
Compilation finished successfully
```

# Test our smart contract 
we will test our contract first locally before deploy it to Celo testnet nerwork 
#### delete the file test/sample-test.js and create a file test/tineyVillageTest.js
 ```javascript
const { expect } = require("chai");
describe("TinyVillage Test", function() {

});
```
#### for this tutorial does not take a long time, we will test two things in the contract 
#### inside the describe, writer the first test, to test if the village is minted
 ```javascript
 it("Should mint village", async function() {
        const accounts = await ethers.getSigners();

        const TinyVillage = await ethers.getContractFactory("TinyVillage");
        const tinyVillage = await TinyVillage.deploy();

        await tinyVillage.mintVillage();
        const balance = await tinyVillage.balanceOf(accounts[0].address,0)
        expect(1).to.equal(Number(balance.toString()));
    });

});
```
#### inside the describe, writer the test if castle the minted, to mint the castle you need mint all other NFT
 ```javascript
 it("Should mint castle",async function () {
        const accounts = await ethers.getSigners();

        const TinyVillage = await ethers.getContractFactory("TinyVillage");
        const tinyVillage = await TinyVillage.deploy();

        await tinyVillage.mintVillage();
        await tinyVillage.mintMine();
        await tinyVillage.mintFarm();
        await tinyVillage.mintMill();
        await tinyVillage.mintCastle();
        const balance = await tinyVillage.balanceOf(accounts[0].address, 4)
        expect(1).to.equal(Number(balance.toString()));
    });
```
#### this is the entire tineyVillageTest.js
 ```javascript
const { expect } = require("chai");

describe("TinyVillage Test", function() {
    it("Should mint village", async function() {
        const accounts = await ethers.getSigners();

        const TinyVillage = await ethers.getContractFactory("TinyVillage");
        const tinyVillage = await TinyVillage.deploy();

        await tinyVillage.mintVillage();
        const balance = await tinyVillage.balanceOf(accounts[0].address,0)
        expect(1).to.equal(Number(balance.toString()));
    });

    it("Should mint castle",async function () {
        const accounts = await ethers.getSigners();

        const TinyVillage = await ethers.getContractFactory("TinyVillage");
        const tinyVillage = await TinyVillage.deploy();

        await tinyVillage.mintVillage();
        await tinyVillage.mintMine();
        await tinyVillage.mintFarm();
        await tinyVillage.mintMill();
        await tinyVillage.mintCastle();
        const balance = await tinyVillage.balanceOf(accounts[0].address, 4)
        expect(1).to.equal(Number(balance.toString()));
    });
});
```
#### now run all the tests using the hardhat 
```bash
 npx hardhat test
 
 TinyVillage Test
    √ Should mint village (5832ms)
    √ Should mint castle (2321ms)


  2 passing (8s)
```

#### now that we compiled and testes the contract we'll deploy 

# Creat a Celo account
to deploy your contract on Celo Testnet will need to create a account and save to address to sent Celo test coin
#### create a file celo_account.js to create and save the account 
```javascript
const Web3 = require('web3')
const fs = require('fs')
const path = require('path')
const web3 = new Web3()
const privateKeyFile = path.join(__dirname, './.secret')

//this function vai return the address of your account
const getAccount = () => {
    const secret = fs.readFileSync(privateKeyFile);
    const account = web3.eth.accounts.privateKeyToAccount(secret.toString())
    //console.log(account.address);
    return account;
}
//this function will crate new account and save the private in .secret file 
const setAccount = () => {
    const newAccount = web3.eth.accounts.create()
    fs.writeFileSync(privateKeyFile, newAccount.privateKey, (err) => {
        if (err) {
            console.log(err);
        }
    })
    console.log(`Address ${newAccount.address}`)
}

module.exports = {
    getAccount,
    setAccount
}
```

#### go to hardhat.config.js,add on top of your code to read the files
```javascript
const fs = require('fs')
const path = require('path')

const privateKeyFile = path.join(__dirname, './.secret')
const Account = require('./celo_account');
```
#### below of others task add new task
```javascript
task("celo-account", "Prints account address or create a new", async () => {
    fs.existsSync(privateKeyFile) ? console.log(`Address ${Account.getAccount().address}`) : Account.setAccount();
});
```
#### run npx hardhat celo-account, to generate a new account and address
```bash
 npx hardhat celo-account
 
 Address <your new address>
```
when run npx hardhat celo-account it's will create a new account and save the account private in .secret,save the address will need to send test coin to deploy the contract, go to https://celo.org/developers/faucet and sent the coin to this address
