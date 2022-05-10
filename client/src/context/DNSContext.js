import React, { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'

const DNSContext = createContext()

export const DNSProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState(null)

    useEffect(() => {
        checkIfWalletIsConnected()
    }, [])

    const checkIfWalletIsConnected = async () => {
        try {
            if (!window.ethereum) return alert("Get MetaMask -> https://metamask.io/")
            const accounts = await window.ethereum.request({ method: 'eth_accounts' })
            if (accounts.length) {
                setCurrentAccount(accounts[0])
            } else {
                alert('No accounts detected. Please connect your wallet.')
            }
        } catch (error) {
            alert(error)
            console.log('Check wallet error: ', error)
        }
    }

    const connectWallet = async () => {
        try {
            if (!window.ethereum) return alert("Get MetaMask -> https://metamask.io/")
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
            setCurrentAccount(accounts[0])
        } catch (error) {
            alert(error)
            console.log('Connect wallet error: ', error)
        }
    }

    const value = { currentAccount, connectWallet }

    return (
        <DNSContext.Provider value={value}>
            {children}
        </DNSContext.Provider>
    )
}

export const useDNSContext = () => useContext(DNSContext)