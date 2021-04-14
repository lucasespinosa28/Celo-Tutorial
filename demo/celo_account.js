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