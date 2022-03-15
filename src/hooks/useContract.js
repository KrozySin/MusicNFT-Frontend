import { useMemo } from "react";
import StoneMusicNFT_ABI from '../contracts/StonMusicNFT.json';
import Exchange_ABI from '../contracts/Exchange.json';

import { useStoneContext } from './useStoneContext';

export const useNFT = () => {
    const { web3 } = useStoneContext();
    return useMemo(() => {
        return new web3.eth.Contract(StoneMusicNFT_ABI, process.env.REACT_APP_NFT_ADDRESS);
    }, [web3]);
}

export const useExchange = () => {
    const { web3 } = useStoneContext();
    return useMemo(() => {
        return new web3.eth.Contract(Exchange_ABI, process.env.REACT_APP_EXCHANGE_ADDRESS);
    }, [web3]);
}