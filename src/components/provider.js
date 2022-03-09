import { useEffect, useState } from "react";
import Web3 from 'web3'
import { StoneContext } from "../context/stoneContext";
import * as WalletUtils from "../core/wallet";


export const StoneProvider = ({children}) => {
    const [account, setAccount] = useState()
    const [web3, setWeb3] = useState(new Web3())
    const [isConnected, setIsConnected] = useState(false)

    const getWeb3 = async () => {
        const provider = await WalletUtils.getCurrentProvider()
        const web3 = new Web3(provider)
        
        return web3
    }
    
    const initAddress = async () => {
        const address = await WalletUtils.getCurrentWallet()
        if (address !== account) setAccount(address === null ? '' : address)
    }

    const initWeb3 = async () => {
        setWeb3(await getWeb3())
        updateConnect()
    }

    const initConnection = async () => {
        if (WalletUtils.isPreviousConnected()) {
          connectWallet()
        }
    }

    const updateConnect = async () => {
        setIsConnected(await WalletUtils.isConnected())
        initAddress()
    }

    const connectWallet = async () => {
        await WalletUtils.connect(updateConnect)
        await initWeb3()
    }
    
    const disconnectWallet = () => {
        WalletUtils.disconnect()
        initAddress()
    }

    useEffect(() => {
        initConnection()
        initWeb3()
    // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (window.ethereum !== undefined) {
            window.ethereum.on('accountsChanged', updateConnect)
            window.ethereum.on('chainChanged', (chainId) => updateConnect())
        }
    }, [])

    useEffect(() => {
        if (!account)
          setIsConnected(false)
        else
          setIsConnected(true)
    }, [account])

    return (
        <StoneContext.Provider value={{
            web3,
            account,
            isConnected,
            disconnectWallet,
            connectWallet,
            updateConnect
        }}>
            {children}
        </StoneContext.Provider>
    )
}