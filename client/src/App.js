import React from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import { useDNSContext } from './context/DNSContext';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const { connectWallet, currentAccount } = useDNSContext()

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">🐱‍👤 Spartan Name Service</p>
              <p className="subtitle">Your immortal API on the blockchain!</p>
            </div>
          </header>
        </div>

        {!currentAccount && (
          <div className="connect-wallet-container">
            <img src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif" alt="Ninja gif" />
            <button onClick={connectWallet} className="cta-button connect-wallet-button">
              Connect Wallet
            </button>
          </div>
        )}

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
}

export default App;