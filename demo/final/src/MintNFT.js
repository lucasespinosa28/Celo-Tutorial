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
        const contract = new kit.web3.eth.Contract(data.abi, "0x47A424A0975924C3d177470C519C8DBA37e16Ec9")
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