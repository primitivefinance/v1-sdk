import { getAccount, newInstance, toWei } from "./web3";
import Web3 from "web3";
import BN from "bn.js";
import ERC20 from "../abi/ERC20.json";
import { DEFAULT_APPROVE, TOKENS_CONTEXT } from "./constants";
import { getNetwork } from "./web3";

const getERC20Instance = async (web3: Web3, address: string): Promise<any> => {
    const instance: any = await newInstance(web3, ERC20.abi, address);
    return instance;
};

const getWethInstance = async (web3: Web3): Promise<any> => {
    const networkId: number = await getNetwork(web3);
    let weth: any = TOKENS_CONTEXT[networkId]["WETH"];
    const instance: any = await newInstance(web3, weth.abi, weth.address);
    return instance;
};

const getAllowance = async (
    web3: Web3,
    instance: any,
    owner: string,
    spender: string
): Promise<BN> => {
    const allowance: BN = new BN(
        await instance.methods.allowance(owner, spender).call()
    );

    return allowance;
};

const checkAllowance = async (
    web3: Web3,
    token: any,
    account: string,
    spender: string,
    amount: number
): Promise<BN> => {
    let allowance: BN = await getAllowance(web3, token, account, spender);
    if (allowance.lt(new BN(toWei(web3, amount)))) {
        await token.methods
            .approve(spender, toWei(web3, DEFAULT_APPROVE))
            .send({
                from: account,
            });
    }
    return allowance;
};

const getBalanceOf = async (
    web3: Web3,
    instance: any,
    account: string
): Promise<BN> => {
    const balance: BN = new BN(
        await instance.methods.balanceOf(account).call()
    );

    return balance;
};

const handleApprove = async (
    web3: Web3,
    contract: string,
    spender: string,
    amount: number
): Promise<Object> => {
    const instance: any = await getERC20Instance(web3, contract);
    const approve: Object = await instance.methods
        .approve(spender, toWei(web3, amount))
        .send({
            from: await getAccount(web3),
        });

    return approve;
};

export {
    getAllowance,
    getERC20Instance,
    handleApprove,
    getBalanceOf,
    checkAllowance,
    getWethInstance,
};
