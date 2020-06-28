import PriceOracleProxy from "../abi/PriceOracleProxy.json";
import Web3 from "web3";
import BN from "bn.js";
import { newInstance } from "./web3";

export const MAINNET_ORACLE = "0xdA17fbEdA95222f331Cb1D252401F4b44F49f7A0";
export const MAINNET_COMPOUND_DAI =
    "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643";

const getEthPriceInDai = async (web3: Web3): Promise<BN> => {
    const oracle: any = await newInstance(
        web3,
        PriceOracleProxy.abi,
        MAINNET_ORACLE
    );
    let price: BN = await oracle.methods
        .getUnderlyingPrice(MAINNET_COMPOUND_DAI)
        .call();
    return price;
};

export { getEthPriceInDai };
