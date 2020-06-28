import Web3 from "web3";
import BN from "bn.js";
import { IBalances } from "./prime";

export interface FormProps {
    children: any;
    web3: Web3;
    id: number;
    balances: IBalances;
    ratio: number;
    fee?: string;
}

export interface BasicFormProps {
    children: any;
    action: Function;
    inputToken: [string, number];
    outputToken: [string, number];
    ratio: number;
    fee?: string;
}
