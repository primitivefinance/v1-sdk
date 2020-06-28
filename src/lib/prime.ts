import Web3 from "web3";
import BN from "bn.js";

import {
    newInstance,
    getAccount,
    toWei,
    fromWei,
    getNetwork,
    getPastEvents,
} from "./web3";

import { OPTIONS, EVENTS } from "./constants";

import { getERC20Instance, getBalanceOf, getWethInstance } from "./ERC20";

import PrimeOption from "../abi/PrimeOption.json";

export interface SimpleOption {
    name: string;
    address: string;
    premium: string;
    current: string;
    strike: string;
    tokenUSymbol: string;
    tokenSSymbol: string;
    expiry: string;
    balance: string;
    net: string;
    earnings: string;
    volatility: string;
    utilization: string;
    available: string;
    equity: any;
    max: string;
    apr: string;
    premiumInDai: string;
    lpBalance: string;
    redeemable: string;
    maxRedeem;
}

export const MOCK_OPTION: SimpleOption = {
    name: "name",
    address: "address",
    premium: "premium",
    current: "current",
    strike: "200.00",
    tokenUSymbol: "WETH",
    tokenSSymbol: "DAI",
    expiry: "June 26",
    balance: "balance",
    net: "net",
    earnings: "earnings",
    volatility: "volatility",
    utilization: "utilization",
    available: "available",
    equity: "equity",
    max: "max",
    apr: "apr",
    premiumInDai: "10.00",
    lpBalance: "lpBalance",
    redeemable: "redeemable",
    maxRedeem: "maxRedeem",
};

export interface IBalances {
    ethers: [string, number];
    tokenW: [string, number];
    tokenU: [string, number];
    tokenS: [string, number];
    tokenP: [string, number];
    tokenR: [string, number];
}

export interface ISymbols {
    ethers: string;
    tokenW: string;
    tokenU: string;
    tokenS: string;
    tokenP: string;
    tokenR: string;
}

export const MOCK_TOKEN: [string, number] = ["...", 0];
export const MOCK_BALANCES: IBalances = {
    ethers: MOCK_TOKEN,
    tokenW: MOCK_TOKEN,
    tokenU: MOCK_TOKEN,
    tokenS: MOCK_TOKEN,
    tokenP: MOCK_TOKEN,
    tokenR: MOCK_TOKEN,
};

/** ===================== CONTRACT GETTERS ===================== */

const getOptionAddress = (
    web3: Web3,
    networkId: number,
    index: number
): string => {
    const address: string = OPTIONS[networkId][index].address;
    return address;
};

const getOptionInstanceWithAddress = async (
    web3: Web3,
    address: string
): Promise<any> => {
    const option: any = await newInstance(web3, PrimeOption.abi, address);
    return option;
};

/** ===================== FUNCTIONS ===================== */

/** ===================== CONSTANTS ===================== */

const getTokenDetails = async (
    web3: Web3,
    index: number
): Promise<[string, string]> => {
    const networkId: number = await getNetwork(web3);
    const tokenP: string = getOptionAddress(web3, networkId, index);
    const prime: any = await getOptionInstanceWithAddress(web3, tokenP);
    const name: string = await prime.methods.name().call();
    const symbol: string = await prime.methods.symbol().call();
    return [name, symbol];
};

const getParameters = async (
    web3: Web3,
    index: number
): Promise<[BN, BN, number]> => {
    const networkId: number = await getNetwork(web3);
    const tokenP: string = getOptionAddress(web3, networkId, index);
    const prime: any = await getOptionInstanceWithAddress(web3, tokenP);
    const base: BN = new BN(await prime.methods.base().call());
    const price: BN = new BN(await prime.methods.price().call());
    const expiry: number = Number(await prime.methods.expiry().call());
    return [base, price, expiry];
};

const getBalances = async (web3: Web3, index: number): Promise<IBalances> => {
    const networkId: number = await getNetwork(web3);
    const account: string = await getAccount(web3);

    const tokenP: string = getOptionAddress(web3, networkId, index);
    const prime: any = await getOptionInstanceWithAddress(web3, tokenP);
    const _tokenP: string = await prime.methods.symbol().call();

    const tokenS: any = await prime.methods.tokenS().call();
    const strike: any = await getERC20Instance(web3, tokenS);
    const _tokenS: string = await strike.methods.symbol().call();

    const tokenU: any = await prime.methods.tokenU().call();
    const underlying: any = await getERC20Instance(web3, tokenU);
    const _tokenU: string = await underlying.methods.symbol().call();

    const tokenR: any = await prime.methods.tokenR().call();
    const redeem: any = await getERC20Instance(web3, tokenR);
    const _tokenR: string = await redeem.methods.symbol().call();

    const weth: any = await getWethInstance(web3);
    const _tokenW: string = await weth.methods.symbol().call();

    const ethers: number = Number(
        web3.utils.fromWei(await web3.eth.getBalance(account))
    );
    let bal = await getBalanceOf(web3, weth, account);
    const balanceW: number = Number(fromWei(web3, bal));
    const balanceU: number = Number(
        fromWei(web3, await getBalanceOf(web3, underlying, account))
    );
    const balanceS: number = Number(
        fromWei(web3, await getBalanceOf(web3, strike, account))
    );
    const balanceP: number = Number(
        fromWei(web3, await getBalanceOf(web3, prime, account))
    );
    const balanceR: number = Number(
        fromWei(web3, await getBalanceOf(web3, redeem, account))
    );
    console.log({ balanceU, balanceW });

    const balances: IBalances = {
        ethers: ["ETH", ethers],
        tokenW: [_tokenW, balanceW],
        tokenU: [_tokenU, balanceU],
        tokenS: [_tokenS, balanceS],
        tokenP: [_tokenP, balanceP],
        tokenR: [_tokenR, balanceR],
    };
    return balances;
};

const getPrimeSymbols = async (
    web3: Web3,
    index: number
): Promise<ISymbols> => {
    const networkId: number = await getNetwork(web3);

    const tokenP: string = getOptionAddress(web3, networkId, index);
    const prime: any = await getOptionInstanceWithAddress(web3, tokenP);
    const _tokenP: string = await prime.methods.symbol().call();

    const tokenS: any = await prime.methods.tokenS().call();
    const strike: any = await getERC20Instance(web3, tokenS);
    const _tokenS: string = await strike.methods.symbol().call();

    const tokenU: any = await prime.methods.tokenU().call();
    const underlying: any = await getERC20Instance(web3, tokenU);
    const _tokenU: string = await underlying.methods.symbol().call();

    const tokenR: any = await prime.methods.tokenR().call();
    const redeem: any = await getERC20Instance(web3, tokenR);
    const _tokenR: string = await redeem.methods.symbol().call();

    const weth: any = await getWethInstance(web3);
    const _tokenW: string = await weth.methods.symbol().call();

    const symbols: ISymbols = {
        ethers: "ETH",
        tokenW: _tokenW,
        tokenU: _tokenU,
        tokenS: _tokenS,
        tokenP: _tokenP,
        tokenR: _tokenR,
    };
    return symbols;
};

const getStrikeBalance = async (
    web3: Web3,
    index: number,
    account: string
): Promise<[string, BN]> => {
    const networkId: number = await getNetwork(web3);
    const tokenP: string = getOptionAddress(web3, networkId, index);
    const prime: any = await getOptionInstanceWithAddress(web3, tokenP);
    const tokenS: any = await prime.methods.tokenS().call();
    const strike: any = await getERC20Instance(web3, tokenS);
    const symbol: string = await strike.methods.symbol().call();
    const balance: BN = await getBalanceOf(web3, tokenS, account);
    return [symbol, balance];
};

const getUnderlyingBalance = async (
    web3: Web3,
    index: number,
    account: string
): Promise<[string, BN]> => {
    const networkId: number = await getNetwork(web3);
    const tokenP: string = getOptionAddress(web3, networkId, index);
    const prime: any = await getOptionInstanceWithAddress(web3, tokenP);
    const tokenU: any = await prime.methods.tokenU().call();
    const underlying: any = await getERC20Instance(web3, tokenU);
    const symbol: string = await underlying.methods.symbol().call();
    const balance: BN = await getBalanceOf(web3, tokenU, account);
    return [symbol, balance];
};

const getRedeemBalance = async (
    web3: Web3,
    index: number,
    account: string
): Promise<[string, BN]> => {
    const networkId: number = await getNetwork(web3);
    const tokenP: string = getOptionAddress(web3, networkId, index);
    const prime: any = await getOptionInstanceWithAddress(web3, tokenP);
    const tokenR: any = await prime.methods.tokenR().call();
    const redeem: any = await getERC20Instance(web3, tokenR);
    const symbol: string = await redeem.methods.symbol().call();
    const balance: BN = await getBalanceOf(web3, tokenR, account);
    return [symbol, balance];
};

const wrapEthToWeth = async (web3: Web3, amount: number): Promise<Object> => {
    let weth: any = await getWethInstance(web3);
    let deposit: Object = await weth.methods.deposit().send({
        from: await getAccount(web3),
        value: toWei(web3, amount),
    });
    return deposit;
};

const unwrapWethToEth = async (web3: Web3, amount: number): Promise<Object> => {
    let weth: any = await getWethInstance(web3);
    let withdraw: Object = await weth.methods
        .withdraw(toWei(web3, amount))
        .send({
            from: await getAccount(web3),
        });
    return withdraw;
};

const getPastTransactions = async (web3: Web3, id: number): Promise<any> => {
    const networkId: number = await getNetwork(web3);
    const address: string = await getOptionAddress(web3, networkId, id);
    const prime: any = await getOptionInstanceWithAddress(web3, address);
    let eventArray: any = EVENTS["prime"];
    let events: any = [];
    for (let i = 0; i < eventArray.length; i++) {
        events.push(await getPastEvents(web3, prime, eventArray[i]));
    }
    console.log(events);
    return events;
};

export {
    getOptionAddress,
    getOptionInstanceWithAddress,
    getPastTransactions,
    getStrikeBalance,
    getUnderlyingBalance,
    getParameters,
    getRedeemBalance,
    getBalances,
    getTokenDetails,
    wrapEthToWeth,
    unwrapWethToEth,
    getPrimeSymbols,
};
