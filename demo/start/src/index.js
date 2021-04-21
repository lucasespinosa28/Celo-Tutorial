import React from 'react';
import ReactDOM from 'react-dom';
import { ContractKitProvider } from '@celo-tools/use-contractkit';
import '@celo-tools/use-contractkit/lib/styles.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <ContractKitProvider dappName="Nft Tutorial">
 <App />
</ContractKitProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
