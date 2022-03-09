import Web3 from 'web3'
import * as ls from 'local-storage'
import * as CONST from './const'

export const connect = async (updateConnect) => {
    if (window.ethereum === undefined) {
      return -1;
    } else {
      // const accounts = await window.ethereum.enable()
      const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
      ls.set(CONST.LOCAL_STORAGE_KEY.KEY_CONNECTED, 1)
      const web3 = new Web3(Web3.givenProvider)

      if (accounts.length > 0) {
        if ((await getCurrentChainId()) !== process.env.REACT_APP_CHAIN_ID) {
          
          try {
            await web3.currentProvider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x' + Number(process.env.REACT_APP_CHAIN_ID).toString(16) }],
            })

            if ((await getCurrentChainId()) === process.env.REACT_APP_CHAIN_ID) {
              
            }
          } catch (error) {
            if (error.code === 4902) {
              try {
                await web3.currentProvider.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: '0x' + Number(process.env.REACT_APP_CHAIN_ID).toString(16),
                      chainName: process.env.REACT_APP_CHAIN_NAME,
                      rpcUrls: [ process.env.REACT_APP_RPC_URL ],
                      nativeCurrency: {
                        name: 'ETH',
                        symbol: 'ETH',
                        decimals: 18,
                      },
                      blockExplorerUrls: [ process.env.REACT_APP_BLOCKEXPLORER ],
                    },
                  ],
                })
              } catch (error) {
                console.log(error)
              }
            } else {
              ls.set(CONST.LOCAL_STORAGE_KEY.KEY_CONNECTED, 0)
            }
          }
        }
      }
    }
}

export const getCurrentProvider = async () => {
    return Web3.givenProvider 
}

export const getCurrentWallet = async () => {
    const connected = ls.get(CONST.LOCAL_STORAGE_KEY.KEY_CONNECTED)

    if (connected === null || connected === 0) return null

    if (
        parseInt(process.env.REACT_APP_CHAIN_ID, 10) !== parseInt(await getCurrentChainId(), 16)
    ) {
        return null
    }

    const accounts = await new Web3(Web3.givenProvider).eth.getAccounts()
    return Web3.utils.toChecksumAddress(accounts[0])
}

export const getCurrentChainId = async () => {
    return Web3.givenProvider.chainId
}

export const isPreviousConnected = () => {
  if (ls.get(CONST.LOCAL_STORAGE_KEY.KEY_CONNECTED) === null || ls.get(CONST.LOCAL_STORAGE_KEY.KEY_CONNECTED) === 0) {
    return false
  }
  return true
}

export const isConnected = async () => {
  if (ls.get(CONST.LOCAL_STORAGE_KEY.KEY_CONNECTED) === null || ls.get(CONST.LOCAL_STORAGE_KEY.KEY_CONNECTED) === 0) {
    return false
  }

  const address = await getCurrentWallet()
  const provider = await getCurrentProvider()
  let chainId = await getCurrentChainId()

  if (address === null || address === '' || provider === null || chainId === null) {
    return false
  }

  chainId = Number.parseInt(chainId.toString())

  if (chainId !== Number.parseInt(process.env.REACT_APP_CHAIN_ID)) {
    return false
  }

  return true
}

export const disconnect = () => {
  ls.set(CONST.LOCAL_STORAGE_KEY.KEY_CONNECTED, 0)
  ls.set(CONST.LOCAL_STORAGE_KEY.KEY_WALLET_CONNECT, '')
}

/* export const signText = async (text, account) => {
  if (!window.ethereum)
    return ''

  await window.ethereum.send("eth_requestAccounts")
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const signature = await signer.signMessage(text)
  return signature

}

export const checkSign = async (text, signature, account) => {
  const signAddress = await ethers.utils.verifyMessage(text, signature)

  return (signAddress === account)
} */

export const sendTransaction = async (transaction, account) => {
  return transaction.estimateGas({ from: account })
  .then(async (gasAmount) => { 
    return transaction.send({ from: account, gas: gasAmount })
  })
}
