import { useContext } from "react";
import { StoneContext } from "../context/stoneContext";

export const useStoneContext = () => {
    const context = useContext(StoneContext);
    if (!context) {
        throw new Error('Make sure to only call stoneContext within a  <StoneProvider>');
    }
    return context;
}