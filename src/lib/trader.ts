import { ethers, BigNumberish } from "ethers";
import { getAccount } from "./web3";
const PrimeTraderDeployed = require("../artifacts/trader.js");
const ERC20 = require("../artifacts/erc20.js");
const PrimeOption = require("../artifacts/PrimeOption.js");
const { parseEther } = ethers.utils;
const TestMnemonic: string = process.env.TEST_MNEMONIC ? process.env.TEST_MNEMONIC : "";

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

export class Trader {
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
        const trader: any = await this.contract();
        const account: string = await getAccount(this.signer);
        const option: ethers.Contract = await getOptionInstance(this.signer, address);
        const underlying: string = await option.tokenU();
        const tokenU: any = await getERC20Instance(this.signer, underlying);
        await checkAllowance(this.signer, tokenU, trader.address, amount);
        let mint: Object;
        try {
            mint = await trader.safeMint(option.address, parseEther(amount.toString()), account);
        } catch (err) {
            console.log({ err });
            mint = {};
        }
        return mint;
    }

    async safeExercise(address: string, amount: number): Promise<Object> {
        const trader: any = await this.contract();
        const account: string = await getAccount(this.signer);
        const option: ethers.Contract = await getOptionInstance(this.signer, address);
        const tokenS: any = await getERC20Instance(this.signer, await option.tokenS());
        await checkAllowance(this.signer, tokenS, trader.address, amount);
        await checkAllowance(this.signer, option, trader.address, amount);
        let inTokenS: BigNumberish = parseEther(amount.toString());
        let inTokenP: number = Number(inTokenS.mul(await option.base()).div(await option.price()));
        let exercise: Object;
        try {
            exercise = await trader.safeExercise(address, inTokenS.toString(), account);
        } catch (err) {
            console.error({ err });
            exercise = {};
        }

        return exercise;
    }

    async safeRedeem(address: string, amount: number): Promise<Object> {
        const trader: any = await this.contract();
        const account: string = await getAccount(this.signer);
        const option: ethers.Contract = await getOptionInstance(this.signer, address);
        const tokenR: any = await getERC20Instance(this.signer, await option.tokenR());
        await checkAllowance(this.signer, tokenR, trader.address, amount);
        let redeem: Object;
        try {
            redeem = await trader.safeRedeem(address, parseEther(amount.toString()), account);
        } catch (err) {
            console.log({ err });
            redeem = {};
        }
        return redeem;
    }

    async safeClose(address: string, amount: number): Promise<Object> {
        const trader: any = await this.contract();
        const account: string = await getAccount(this.signer);
        const option: ethers.Contract = await getOptionInstance(this.signer, address);
        const tokenR: any = await getERC20Instance(this.signer, await option.tokenR());
        await checkAllowance(this.signer, tokenR, trader.address, amount);
        await checkAllowance(this.signer, option, trader.address, amount);
        let close: Object;
        try {
            close = await trader.safeClose(address, parseEther(amount.toString()), account);
        } catch (err) {
            console.error({ err });
            close = {};
        }
        return close;
    }
}

async function main() {
    const provider = ethers.getDefaultProvider("rinkeby");
    const signer = ethers.Wallet.fromMnemonic(TestMnemonic);
    const Alice = await signer.connect(provider);
    const option: string = "0xf0481628ec335e0Cc0c0383866CfE88eE4a55c9D";
    const trader = new Trader(provider, Alice);
    const result = await trader.safeRedeem(option, 1);
    console.log(result);
}

main();
