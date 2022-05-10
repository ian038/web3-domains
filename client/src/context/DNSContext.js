import React, { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { networks } from '../utils/networks'
import domainAbi from '../utils/Domains.json'

const DNSContext = createContext()
const CONTRACT_ADDRESS = '0x67659BAab2807e7c8703E96b57a6c1d2Ced537dD'

export const DNSProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState(null)
    const [domain, setDomain] = useState('');
    const [record, setRecord] = useState('');
    const [network, setNetwork] = useState('');
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mints, setMints] = useState([]);

    useEffect(() => {
        checkIfWalletIsConnected()
    }, [])

    useEffect(() => {
        if (network === 'Polygon Mumbai Testnet') {
            fetchMints();
        }
    }, [currentAccount, network]);

    const checkIfWalletIsConnected = async () => {
        try {
            if (!window.ethereum) return alert("Get MetaMask -> https://metamask.io/")
            const accounts = await window.ethereum.request({ method: 'eth_accounts' })
            if (accounts.length) {
                setCurrentAccount(accounts[0])
            } else {
                alert('No accounts detected. Please connect your wallet.')
            }

            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            setNetwork(networks[chainId]);

            window.ethereum.on('chainChanged', handleChainChanged);

            function handleChainChanged(_chainId) {
                window.location.reload();
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

    const mintDomain = async () => {
        if (!domain) { return }
        if (domain.length < 3) {
            alert('Domain must be at least 3 characters long');
            return;
        }
        const price = domain.length === 3 ? '0.2' : domain.length === 4 ? '0.3' : '0.1';
        console.log("Minting domain", domain, "with price", price);
        try {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS, domainAbi.abi, signer);

                let tx = await contract.register(domain, { value: ethers.utils.parseEther(price) });
                const receipt = await tx.wait();

                if (receipt.status === 1) {
                    console.log("Domain minted! https://mumbai.polygonscan.com/tx/" + tx.hash);

                    tx = await contract.setRecord(domain, record);
                    await tx.wait();

                    console.log("Record set! https://mumbai.polygonscan.com/tx/" + tx.hash);

                    setTimeout(() => {
                        fetchMints();
                    }, 2000)

                    setRecord('');
                    setDomain('');
                }
                else {
                    alert("Transaction failed to mint domain! Please try again");
                }
            }
        } catch (error) {
            alert('Error minting domain!')
            console.log('Mint domain error: ', error);
        }
    }

    const switchNetwork = async () => {
        if (window.ethereum) {
            try {
                // Switch to the Mumbai testnet
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x13881' }]
                });
            } catch (error) {
                // This error code means that the chain we want has not been added to MetaMask
                if (error.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: '0x13881',
                                    chainName: 'Polygon Mumbai Testnet',
                                    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                                    nativeCurrency: {
                                        name: "Mumbai Matic",
                                        symbol: "MATIC",
                                        decimals: 18
                                    },
                                    blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
                                },
                            ],
                        });
                    } catch (error) {
                        console.log(error);
                    }
                }
                console.log(error);
            }
        } else {
            alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
        }
    }

    const updateDomain = async () => {
        if (!record || !domain) { return }
        setLoading(true);
        console.log("Updating domain", domain, "with record", record);
        try {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS, domainAbi.abi, signer);

                let tx = await contract.setRecord(domain, record);
                await tx.wait();
                console.log("Record set https://mumbai.polygonscan.com/tx/" + tx.hash);

                fetchMints();
                setRecord('');
                setDomain('');
            }
        } catch (error) {
            alert('Error updating record')
            console.log('Error updating record ', error);
        }
        setLoading(false);
    }

    const fetchMints = async () => {
        try {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS, domainAbi.abi, signer);
                const names = await contract.getAllNames();

                const mintRecords = await Promise.all(names.map(async (name) => {
                    const mintRecord = await contract.records(name);
                    const owner = await contract.domains(name);
                    return {
                        id: names.indexOf(name),
                        name: name,
                        record: mintRecord,
                        owner: owner
                    };
                }));
                console.log("MINTS FETCHED ", mintRecords);
                setMints(mintRecords);
            }
        } catch (error) {
            alert('Error fetching domains')
            console.log('Fetch mints error ', error);
        }
    }

    const editRecord = (name) => {
        console.log("Editing record for", name);
        setEditing(true);
        setDomain(name);
    }

    const value = {
        currentAccount,
        connectWallet,
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
    }

    return (
        <DNSContext.Provider value={value}>
            {children}
        </DNSContext.Provider>
    )
}

export const useDNSContext = () => useContext(DNSContext)