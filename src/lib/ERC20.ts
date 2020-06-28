import { getAccount, newInstance, toWei } from "./web3";
import { ethers, BigNumberish } from "ethers";
import BN from "bn.js";
const ERC20 = require("../artifacts/erc20.js");

const getERC20Instance = async (signer: ethers.Signer, address: string): Promise<any> => {
    const instance: any = await newInstance(signer, ERC20.abi, address);
    return instance;
};

const getAllowance = async (
    signer: ethers.Signer,
    instance: any,
    owner: string,
    spender: string
): Promise<BN> => {
    const allowance: BN = new BN(await instance.methods.allowance(owner, spender).call());

    return allowance;
};

const checkAllowance = async (
    owner: ethers.Signer,
    tokenU: ethers.Contract,
    spender: string,
    amount: any
) => {
    const allowance: BigNumberish = await tokenU.allowance(owner.getAddress(), spender);
    if (allowance < amount) await handleApprove(owner, tokenU, spender, amount);
};

const handleApprove = async (
    owner: ethers.Signer,
    contract: ethers.Contract,
    spender: string,
    amount: number
): Promise<Object> => {
    const approve: Object = await contract.approve(spender, amount);
    return approve;
};

const getBalanceOf = async (signer: ethers.Signer, instance: any, account: string): Promise<BN> => {
    const balance: BN = new BN(await instance.methods.balanceOf(account).call());

    return balance;
};

export {
    getAllowance,
    getERC20Instance,
    handleApprove,
    getBalanceOf,
    checkAllowance,
    getWethInstance,
};
