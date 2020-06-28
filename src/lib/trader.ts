/* import { getOptionAddress, getOptionInstanceWithAddress } from "./prime";
import { checkAllowance, getERC20Instance } from "./ERC20";
import { TOKENS_CONTEXT } from "./constants";
import { newInstance, getAccount, toWei, getNetwork } from "./web3";
import BN from "bn.js"; */

/* const PrimeTrader = require("@primitivefi/contracts/artifacts/PrimeTrader.json"); */
const PrimeTraderDeployed = require("../artifacts/trader.js");
const ERC20 = require("../artifacts/erc20.js");
const PrimeOption = require("../artifacts/PrimeOption.js");
import { ethers, ContractInterface, BigNumberish } from "ethers";
import { getAccount } from "./web3";
const { parseEther } = ethers.utils;
const TestMnemonic: string = process.env.TEST_MNEMONIC ? process.env.TEST_MNEMONIC : "";

console.log("starting class");

const getERC20Instance = async (
    signer: ethers.Signer,
    address: string
): Promise<ethers.Contract> => {
    const contract: ethers.Contract = new ethers.Contract(address, ERC20.abi, signer);
    return contract;
};

const getOptionInstance = async (
    signer: ethers.Signer,
    address: string
): Promise<ethers.Contract> => {
    const contract: ethers.Contract = new ethers.Contract(address, PrimeOption.abi, signer);
    return contract;
};

const checkAllowance = async (
    owner: ethers.Signer,
    tokenU: ethers.Contract,
    spender: string,
    amount: any
) => {
    const allowance: BigNumberish = await tokenU.allowance(owner.getAddress(), spender);
    if (allowance <= amount) await tokenU.approve(spender, amount);
};

class Trader {
    provider: ethers.providers.Provider;
    signer: ethers.Signer;
    constructor(provider: ethers.providers.Provider, signer: ethers.Signer) {
        this.provider = provider;
        this.signer = signer;
    }

    async contract(): Promise<ethers.Contract> {
        const contract: ethers.Contract = new ethers.Contract(
            await this.address(),
            PrimeTraderDeployed.abi,
            this.signer
        );
        return contract;
    }

    async address(): Promise<string> {
        const chain: ethers.providers.Network = await this.provider.getNetwork();
        const address: string = PrimeTraderDeployed.address;
        return address;
    }

    async safeMint(address: string, amount: number): Promise<Object> {
        const account: string = await getAccount(this.signer);
        const option: ethers.Contract = await getOptionInstance(this.signer, address);
        const underlying: string = await option.tokenU({ from: this.signer.getAddress() });
        const tokenU: any = await getERC20Instance(this.signer, underlying);
        await checkAllowance(this.signer, tokenU, await this.address(), amount);
        let mint: Object;
        try {
            mint = await (await this.contract()).safeMint(
                option.address,
                parseEther(amount.toString()),
                account
            );
        } catch (err) {
            console.log({ err });
            mint = {};
        }

        return mint;
    }
}

async function main() {
    const provider = ethers.getDefaultProvider("rinkeby");
    const signer = ethers.Wallet.fromMnemonic(TestMnemonic);
    const Alice = await signer.connect(provider);
    const trader = new Trader(provider, Alice);
    const option: string = "0xf0481628ec335e0Cc0c0383866CfE88eE4a55c9D";
    const mint = await trader.safeMint(option, 1);
    console.log(mint);
}

/* function main() {
    const trader = new Trader(ethers.getDefaultProvider());
    console.log("test", trader);
} */
main();

/* const getPrimeTrader = async (signer: ethers.Signer, networkId: number): Promise<any> => {
    const address: string = TOKENS_CONTEXT[networkId]["TRADER"].address;
    const trader: any = await newInstance(signer, PrimeTrader.abi, address);
    return trader;
};

const safeExercise = async (
    signer: ethers.Signer,
    index: number,
    amount: number
): Promise<Object> => {
    const networkId: number = await getNetwork(signer);
    const trader: any = await getPrimeTrader(signer, networkId);
    const account: string = await getAccount(signer);
    const tokenP: string = await getOptionAddress(signer, networkId, index);
    const option: any = await getOptionInstanceWithAddress(signer, tokenP);
    const tokenS: any = await getERC20Instance(signer, await option.methods.tokenS().call());
    await checkAllowance(signer, tokenS, account, trader._address, amount);
    await checkAllowance(signer, option, account, trader._address, amount);
    let inTokenS: BN = new BN(toWei(signer, amount));
    let inTokenP: number = Number(
        inTokenS
            .mul(new BN(await option.methods.base().call()))
            .div(new BN(await option.methods.price().call()))
    );
    let exercise: Object;
    console.log(inTokenS.toString(), inTokenP.toString());
    try {
        exercise = await trader.methods.safeSwap(tokenP, inTokenS.toString(), account).send({
            from: account,
        });
    } catch (err) {
        console.error({ err });
        exercise = {};
    }

    return exercise;
};

const safeMint = async (signer: ethers.Signer, index: number, amount: number): Promise<Object> => {
    console.log(amount);
    const networkId: number = await getNetwork(signer);
    const trader: any = await getPrimeTrader(signer, networkId);
    const account: string = await getAccount(signer);
    const tokenP: string = await getOptionAddress(signer, networkId, index);
    const option: any = await getOptionInstanceWithAddress(signer, tokenP);
    const tokenU: any = await getERC20Instance(signer, await option.methods.tokenU().call());
    await checkAllowance(signer, tokenU, account, trader._address, amount);
    let write: Object;
    try {
        write = await trader.methods.safeMint(tokenP, toWei(signer, new BN(amount)), account).send({
            from: account,
        });
    } catch (err) {
        console.log({ err });
        write = {};
    }

    return write;
};

const safeRedeem = async (
    signer: ethers.Signer,
    index: number,
    amount: number
): Promise<Object> => {
    const networkId: number = await getNetwork(signer);
    const trader: any = await getPrimeTrader(signer, networkId);
    const account: string = await getAccount(signer);
    const tokenP: string = await getOptionAddress(signer, networkId, index);
    const option: any = await getOptionInstanceWithAddress(signer, tokenP);
    const tokenR: any = await getERC20Instance(signer, await option.methods.tokenR().call());
    await checkAllowance(signer, tokenR, account, trader._address, amount);
    let redeem: Object;
    console.log(amount);
    console.log(
        index,
        await option.methods.name().call(),
        tokenP,
        trader._address,
        account,
        toWei(signer, amount)
    );
    try {
        redeem = await trader.methods
            .safeRedeem(tokenP, toWei(signer, new BN(amount)), account)
            .send({
                from: account,
            });
    } catch (err) {
        console.log({ err });
        redeem = {};
    }

    return redeem;
};

const safeClose = async (signer: ethers.Signer, index: number, amount: number): Promise<Object> => {
    const networkId: number = await getNetwork(signer);
    const trader: any = await getPrimeTrader(signer, networkId);
    const account: string = await getAccount(signer);
    const tokenP: string = await getOptionAddress(signer, networkId, index);
    const option: any = await getOptionInstanceWithAddress(signer, tokenP);
    const tokenR: any = await getERC20Instance(signer, await option.methods.tokenR().call());
    await checkAllowance(signer, tokenR, account, trader._address, amount);
    await checkAllowance(signer, option, account, trader._address, amount);
    let close: Object;
    try {
        close = await trader.methods.safeClose(tokenP, toWei(signer, amount), account).send({
            from: account,
        });
    } catch (err) {
        console.error({ err });
        close = {};
    }

    return close;
};

export { getPrimeTrader, safeExercise, safeMint, safeRedeem, safeClose }; */
