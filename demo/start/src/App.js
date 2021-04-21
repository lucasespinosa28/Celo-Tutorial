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