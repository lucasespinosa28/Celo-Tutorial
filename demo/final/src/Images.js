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
        const contract = new kit.web3.eth.Contract(data.abi, "0x47A424A0975924C3d177470C519C8DBA37e16Ec9")
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