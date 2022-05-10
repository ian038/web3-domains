import React from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import polygonLogo from './assets/polygonlogo.png';
import ethLogo from './assets/ethlogo.png';
import { useDNSContext } from './context/DNSContext';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const tld = '.spartan'

const App = () => {
  const {
    connectWallet,
    currentAccount,
    domain,
    setDomain,
    record,
    setRecord,
    mintDomain,
    network,
    switchNetwork,
    updateDomain,
    loading,
    editing,
    setEditing,
    mints,
    CONTRACT_ADDRESS,
    editRecord
  } = useDNSContext()


  const renderConnectWallet = () => (
    <div className="connect-wallet-container">
      <img src="https://media.giphy.com/media/vP5tCg09mctxuPwY1C/giphy-downsized-large.gif" alt="Spartan gif" />
      <button onClick={connectWallet} className="cta-button connect-wallet-button">
        Connect Wallet
      </button>
    </div>
  )

  const renderInputForm = () => {
    if (network !== 'Polygon Mumbai Testnet') {
      return (
        <div className="connect-wallet-container">
          <p>Please connect to the Polygon Mumbai Testnet</p>
          <button className='cta-button mint-button' onClick={switchNetwork}>Click here to switch</button>
        </div>
      );
    }

    return (
      <div className="form-container">
        <div className="first-row">
          <input
            type="text"
            value={domain}
            placeholder='domain'
            onChange={e => setDomain(e.target.value)}
          />
          <p className='tld'> {tld} </p>
        </div>
        <input
          type="text"
          value={record}
          placeholder='whats your personal website'
          onChange={e => setRecord(e.target.value)}
        />
        {editing ? (
          <div className="button-container">
            <button className='cta-button mint-button' disabled={loading} onClick={updateDomain}>
              Set record
            </button>
            <button className='cta-button mint-button' onClick={() => { setEditing(false); setDomain(''); setRecord('') }}>
              Cancel
            </button>
          </div>
        ) : (
          <button className='cta-button mint-button' disabled={loading} onClick={mintDomain}>
            Mint
          </button>
        )}
      </div>
    )
  }

  const renderMints = () => {
    if (currentAccount && mints.length > 0) {
      return (
        <div className="mint-container">
          <p className="subtitle"> Recently minted domains!</p>
          <div className="mint-list">
            {mints.map((mint, index) => {
              return (
                <div className="mint-item" key={index}>
                  <div className='mint-row'>
                    <a className="link" href={`https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${mint.id}`} target="_blank" rel="noopener noreferrer">
                      <p className="underlined">{' '}{mint.name}{tld}{' '}</p>
                    </a>
                    {mint.owner.toLowerCase() === currentAccount.toLowerCase() ?
                      <button className="edit-button" onClick={() => editRecord(mint.name)}>
                        <img className="edit-icon" src="https://img.icons8.com/metro/26/000000/pencil.png" alt="Edit button" />
                      </button>
                      :
                      null
                    }
                  </div>
                  <p> {mint.record} </p>
                </div>)
            })}
          </div>
        </div>
      );
    }
  }

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">⚔ Spartan Name Service</p>
              <p className="subtitle">Your personal API on the blockchain!</p>
            </div>
            <div className="right">
              <img alt="Network logo" className="logo" src={network.includes("Polygon") ? polygonLogo : ethLogo} />
              {currentAccount ? <p> Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p> : <p> Not connected </p>}
            </div>
          </header>
        </div>

        {!currentAccount && renderConnectWallet()}
        {currentAccount && renderInputForm()}
        {mints && renderMints()}

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