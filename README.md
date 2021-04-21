# Celo-Tutorial

# How to create a erc1155 contract and connect a Celo wallet in your app
In this tutorial we'll write a smart contract using the Solidity language and a contract from the Openzeppelin library for ERC1155 tokens. Using nodejs along with Hardhat we will compile the smart contract code and also test the contract before deploying it. After deploying the contract we will create a custom task within Hardhat to create a Celo account and deploy the contract to the Celo network using [DataHub](https://datahub.figment.io). Lastly, we are going to use `create-react-app` to generate a React application that will connect to the Celo wallet account and interact with the deployed smart contract. 

![Captura de Tela (39)](https://user-images.githubusercontent.com/52639395/114646091-01e71d00-9cb1-11eb-8acc-214c255d2d4c.png)

# Prerequisites 
 - We must have NodeJS >= v12.0 installed, preferably the latest version or an LTS release.
 - Knowledge of JavaScript, Solidity and React is beneficial.

# Install and use Hardhat
Hardhat is a development environment that compiles, deploys, tests, and helps you to debug your Ethereum smart contracts. Hardhat can also be used to deploy to the Celo network because Celo also runs the EVM (Ethereum Virtual Machine). This means smart contracts which work on Ethereum will also work on Celo. For the purposes of this tutorial, we will assume that the reader understands how to initialize a new Node project with a package manager (`npm` or `yarn`). We will go over how to install and configure Hardhat now.

#### Installing Hardhat
```bash
npm install --save-dev hardhat
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers web3 @celo/contractkit
```

#### Creating a new Hardhat project
From within the project directory, run :
```bash
npx hardhat
```
Selecting 'Create a sample project' will allow Hardhat to start its installation process in the current directory. It will create subdirectories and put all of the necessary files in place to empower your project. 
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
# Smart contracts using the OpenZeppelin ERC1155 library
ERC1155 is a novel token standard that aims to take the best from previous standards to create a fungibility-agnostic and gas-efficient token contract.
ERC1155 draws ideas from all of ERC20, ERC721, and ERC777. ERC1155s are commonly used in NFT collectible projects, although they are not typically viewed as 'fine art' it is not unreasonable to use this token standard for such purposes. We will examine the use case of a token meant specifically for use within our Tiny Village.
#### Install the OpenZeppelin contracts and create your smart contract file
 ```bash
npm install @openzeppelin/contracts
touch  contracts/TinyVillage.sol
```
#### Write your smart contract 
Let's add a license to your code ```SPDX License Identifier```, the source code of the smart contract will be visible on the blockchain, it's a best practice to add a license to your code to avoid the problem if other people use this code.  with ```pragma solidity ^0.8.0;``` we'll choose a compilation version,the compile version of your code and libraries must be compatible,The ```import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol``` will import the ERC1155.sol and other solidity files that ERC1155 will need to compile. Create the ``` contract TinyVillage  is ERC1155``` and tell to use library ERC1155.

### ⚠ If you are using Remix import the ERC1155 module using.
```solidity
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
```
 ```solidity
 //SPDX-License-Identifier: MIT
 pragma solidity ^0.8.0;
 import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
 contract TinyVillage  is ERC1155 {
}
```
#### Write the NFT parth of smart contract
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
# Deploy the smart contract
if you tested your smart contract and have an account with Celo to pay to deploy it's time to Finalmente deploy the contract
#### create file celo_deploy.js
#### add node modules 
```javascript
 const Web3 = require('web3')
const ContractKit = require('@celo/contractkit')
```
#### now go to [DataHub (figment.io)](https://datahub.figment.io/)and chose Celo, copy celo-alfajores--rpc.datahub.figment.io and save the api key 
![Captura de Tela (43)](https://user-images.githubusercontent.com/52639395/114647928-46c08300-9cb4-11eb-90a4-5a8600c7696d.png)
```javascript
const web3 = new Web3('https://celo-alfajores--rpc.datahub.figment.io/apikey/<key>/')
const kit = ContractKit.newKitFromWeb3(web3)
const data = require('./artifacts/contracts/TinyVillage.sol/TinyVillage.json')
const Account = require('./celo_account');
```
#### now write the function that will deploy the contract
```javascript
async function TinyVillage() {
    const account = Account.getAccount()
    kit.connection.addAccount(account.privateKey) 
    let tx = await kit.connection.sendTransaction({
        from: account.address,
        data: data.bytecode
    })
     return tx.waitReceipt()
}
module.exports = {
    TinyVillage
}
```
#### the entire tineyVillageTest.js
```javascipt
const Web3 = require('web3')
const ContractKit = require('@celo/contractkit')
const web3 = new Web3('https://celo-alfajores--rpc.datahub.figment.io/apikey/<api key>/')
const kit = ContractKit.newKitFromWeb3(web3)
const data = require('./artifacts/contracts/TinyVillage.sol/TinyVillage.json')
const Account = require('./celo_account');
async function TinyVillage() {
    const account = Account.getAccount()
    kit.connection.addAccount(account.privateKey) 
    let tx = await kit.connection.sendTransaction({
        from: account.address,
        data: data.bytecode
    })
     return tx.waitReceipt()
}
module.exports = {
    TinyVillage
}
```
#### in hardhat.config add a celo_deploy.js and new task
```javascript
const Deploy = require('./celo_deploy');
```
```javascript
task("celo-deploy", "Prints account address or create a new", async () => {
    const tx = await Deploy.TinyVillage();
    console.log(tx);
    console.log(`save the contract address ${tx.contractAddress}`)
});
```
#### now run npx hardhat celo-account, save the address and go to [Celo faucet](https://celo.org/developers/faucet), get the coins to deploy
```bash
npx hardhat celo-account 
```
```bash
npx hardhat celo-deploy
```
#### save the contract address to use in our app next
# Creat a react app
Ourreact app that will connect to celo wallet and interact with the smart contract
#### install react and celo contract kit 
```bash
npx create-react-app app 
npm install @celo-tools/use-contractkit@0.0.30
```
#### copy the file in hardhat folder  artifacts\contracts\TinyVillage.sol\TinyVillage.json and place  in src folder on react app,in public  folder  add new folder imgs and dowload the images , [zip with images](https://gateway.pinata.cloud/ipfs/QmPrKSh5cXA6NxHgm3cEzmhScafUnaBbvpXCeYJFyuG4Ph) or in [Github](https://github.com/lucasespinosa28/Celo-Tutorial/ )
#### in public/index,replace  
```html
<title>React App</title>
```
#### and add new name and bootstrap
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">
<title>Celo App</title>
```
#### add ContractKit in src/index.js to connect celo account
```javascript
import { ContractKitProvider } from '@celo-tools/use-contractkit';
import '@celo-tools/use-contractkit/lib/styles.css';
```
#### replace the <React.StrictMode> to
```javascript
<ContractKitProvider dappName="Nft Tutorial">
 <App />
</ContractKitProvider>,
```
#### now create file src/Images.js , it's file will display an image depending on the balance of Nft 
```javascript
//import all code necessary 
import {
    useContractKit,
} from '@celo-tools/use-contractkit';
import React, { useState } from 'react';
import data from "./TinyVillage.json";
// this component will return an image depending on its balance 
function Images() {
    // kit is used to interact with contract
    // address will show the address of connect account
    const { kit, address } = useContractKit();
    //Store the source image     
    let imagesource;
    //React will store the balance when the async function end
    const [balanceArray, setBalanceArray] = useState();
    if (address.length > 0) {
        //Access a the contract
        const contract = new kit.web3.eth.Contract(data.abi, <contract address>)
        //Array with address NFT's owner 
        const ownerAddress = [address, address, address, address, address]
        //Array with NFT's id      
        const ownerIds = [0, 1, 2, 3, 4]
        //Function that will return the NFT that you have
        async function getBalance() {
            const balances = await contract.methods.balanceOfBatch(ownerAddress, ownerIds).call();
            setBalanceArray(balances);
        }
        // When balanceArray is not null this part of the code will be activated 
        if (balanceArray != null) {
            switch (balanceArray.toString()) {
                case "1,0,0,0,0":
                    imagesource = "./imgs/village.jpg";
                    break;
                case "1,1,0,0,0":
                    imagesource = "./imgs/mine.jpg";
                    break;
                case "1,0,1,0,0":
                    imagesource = "./imgs/farm.jpg";
                    break;
                case "1,0,1,1,0":
                    imagesource = "./imgs/farm-mill.jpg";
                    break;
                case "1,1,1,0,0":
                    imagesource = "./imgs/mine-farm.jpg";
                    break;
                case "1,1,1,1,0":
                    imagesource = "./imgs/mine-farm-mill.jpg";
                    break;
                case "1,1,1,1,1":
                    imagesource = "./imgs/castle.jpg";
                    break;
                default:
                    imagesource = "./imgs/empty.jpg";
            }
        }
        // Run the code above 
        getBalance()
    } else {
        imagesource = "./imgs/empty.jpg";
    }
    return (
        <img src={imagesource} />
    )
}
export default Images
```
#### now create file src/MintNFT.js,it will create the button to mint NFT in specific order
```javascript
//import all code necessary
import {
    useContractKit,
} from '@celo-tools/use-contractkit';
import React, { useState } from 'react';
import data from "./TinyVillage.json";
// this component will return  buttons to mint Nft
function MintNFT() {
    // kit is used to interact with contract
    // address will show the address of connect account
    const { kit, address } = useContractKit();
    //Store button compoments     
    let buttons;
    //React will store the balance when the async function end
    const [balanceArray, setBalanceArray] = useState();
    if (address.length > 0) {
        //Access a the contract
        const contract = new kit.web3.eth.Contract(data.abi, <contract address>)
        //Array with address NFT's owner 
        const ownerAddress = [address, address, address, address, address]
        //Array with NFT's id     
        const ownerIds = [0, 1, 2, 3, 4]
        //Function that will return the NFT that you have
        async function getBalance() {
            const data = await contract.methods.balanceOfBatch(ownerAddress, ownerIds).call();
            setBalanceArray(data);
        }
        // Run the code above 
        getBalance();
        //this function will coin NFT depending on the name you give 
        async function Mint(name) {
            console.log(balanceArray);
            contract.methods.[name]().send({ from: address })
                .on('transactionHash', function (hash) {
                    console.log(hash);
                })
                .on('receipt', function (receipt) {
                    console.log(receipt);
                })
                .on('error', function (error, receipt) {
                    console.log(error);
                    console.log(receipt);
                });
        }
        // When the balanced Array is not null this part of the code will be activated and will show a button to mint an NFT that you don't have
        if (balanceArray != null) {
            switch (balanceArray.toString()) {
                case "1,0,0,0,0":
                    buttons =
                        <div className="row">
                            <button className="btn btn-success my-2" onClick={() => Mint("mintMine")}>Mint Mine</button>
                            <button className="btn btn-success my-2" onClick={() => Mint("mintFarm")}>Mint Farm</button>
                        </div>
                    break;
                case "1,1,0,0,0":
                    buttons =
                        <div className="row">
                            <button className="btn btn-success my-2" onClick={() => Mint("mintFarm")}>Mint Farm</button>
                        </div>
                    break;
                case "1,0,1,0,0":
                    buttons =
                        <div className="row">
                            <button className="btn btn-success my-2" onClick={() => Mint("mintMine")}>Mint Mine</button>
                            <button className="btn btn-success my-2" onClick={() => Mint("mintMill")}>Mint Mill</button>
                        </div>
                    break;
                case "1,0,1,1,0":
                    buttons =
                        <div className="row">
                            <button className="btn btn-success my-2" onClick={() => Mint("mintMine")}>Mint Mine</button>
                        </div>
                    break;
                case "1,1,1,0,0":
                    buttons =
                        <div className="row">
                            <button className="btn btn-success my-2" onClick={() => Mint("mintMill")}>Mint Mill</button>
                        </div>
                    break;
                case "1,1,1,1,0":
                    buttons =
                        <div className="row">
                            <button className="btn btn-success my-2" onClick={() => Mint("mintCastle")}>Mint Castle</button>
                        </div>
                    break;
                case "1,1,1,1,1":
                    buttons = <div className="row"></div>
                    break;
                default:
                    buttons = <div div className="row my-2"> <button className="btn btn-success" onClick={() => Mint("mintVillage")}>Mint Village</button></div>
            }
        }
    } else {
        buttons = <div></div>
    }
    //mintVillage
    return (
        <div>{buttons}</div>
    )
}
export default MintNFT
```
#### last put all things togher in src/app.js
```javascript
import Images from './Images';
import MintNFT from './MintNFT';
import {
    useContractKit,
    Alfajores,
} from '@celo-tools/use-contractkit';
function App() {
    const { openModal, address, updateNetwork } = useContractKit();
    updateNetwork(Alfajores);
    let account;
    //dectect if have a account connect
    if (address.length == 0) {
        account = "Connect a wallet to have Address"
    } else {
        account = address;
    }
    //build the app compoments
    return (<div className="container">
        <div className="row mb-3">
            <button className="btn btn-warning" onClick={openModal}>Connect wallet</button>
        </div>
        <div className="row">
            <div className="col">
                <h1 className="text-break alert alert-primary">{account}</h1>
            </div>
        </div>
        <div className="row">
            <Images />
        </div>
            <MintNFT />
    </div>);
}
export default App;
```
#### now test if the app are running, npm start this must be the result 
```bash 
npm start
```
![Captura de Tela (41)](https://user-images.githubusercontent.com/52639395/114646237-47a3e580-9cb1-11eb-9edc-43fd0baaa17a.png)
