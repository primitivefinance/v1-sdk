import { ethers, BigNumberish } from "ethers";
//import { getTokenAddress, getTokenAbi } from "./utils";

/**
 * @dev converts a number from 10^18 decimal places
 * @param {number} weiAmount a string amount to convert from 10^18 decimals
 * @returns a number that is 10^-18
 */
const fromWei = (weiAmount: BigNumberish | string): string => {
    const fromWeiAmount: string = ethers.utils.parseEther(weiAmount.toString()).toString();
    return fromWeiAmount;
};

/**
 * @dev converts a number to 10^18 decimal places
 * @param {number} amount a string amount to convert to 10^18 decimals
 * @returns a number that has 10^18 decimal places
 */
const toWei = (amount: number | BigNumberish): string => {
    const toWeiAmount: string = ethers.utils.parseEther(amount.toString()).toString();
    return toWeiAmount;
};

const getBalance = async (signer: ethers.Signer): Promise<BigNumberish> => {
    const account: string = await getAccount(signer);
    const balance: BigNumberish = await signer.getBalance(account);
    return balance;
};

/**
 * @dev gets the connected account address
 * @param signer
 * @returns address of account
 */
const getAccount = async (signer: ethers.Signer): Promise<string> => {
    const account: string = await signer.getAddress();
    return account;
};

/**
 * @dev gets the currently connected network Id
 * @returns networkId
 */
const getNetwork = async (provider: ethers.providers.Provider): Promise<number> => {
    if (provider) {
        let network: ethers.providers.Network = await provider.getNetwork();
        let networkId: number = 1;
        return networkId;
    } else {
        return 0;
    }
};

/**
 * @dev gets an Instance from a JSON artifact
 * @param contract a local JSON artifact of the contract
 * @returns an instance of the contract
 */
const getContractInstance = async (
    provider: ethers.providers.Provider,
    signer: ethers.Signer,
    contract: any
) => {
    const networkId: number = await getNetwork(provider);

    // GET contract
    let deployedNetwork: any = await contract.networks[networkId];
    if (!deployedNetwork) {
        console.log("Network Undefined");
        return;
    }
    const instance: any = new ethers.Contract(deployedNetwork?.address, contract.abi, signer);
    return instance;
};

/**
 * @dev gets an ERC-20 instance using a local data store of the abi and address
 * @param symbol a symbol of the ERC-20 contract instance to get
 * @returns an instance of the symbol's contract
 */
/* const getInstance = async (
    provider: ethers.providers.Provider,
    signer: ethers.Signer,
    symbol: string
) => {
    const networkId: number = await getNetwork(provider);
    // GET CONTRACT
    let address = getTokenAddress(networkId, symbol);
    let abi = getTokenAbi(networkId, symbol);
    const instance = new ethers.Contract(address, abi, signer);
    return instance;
}; */

/**
 * @dev gets an ERC-20 instance using a local data store of the abi and address
 * @param symbol a symbol of the ERC-20 contract instance to get
 * @returns an instance of the symbol's contract
 */
const newInstance = async (signer: ethers.Signer, abi: any, address: string) => {
    const instance = new ethers.Contract(address, abi, signer);
    return instance;
};

/**
 * @dev Gets past events from a contract.
 * @param instance A contract instance.
 * @param event An event to get
 */
const getPastEvents = async (
    provider: ethers.providers.Provider,
    signer: ethers.Signer,
    instance: any,
    event: string
): Promise<Object> => {
    const account: string = await getAccount(signer);
    let result;
    try {
        result = await instance.getPastEvents(event, {
            filter: { from: account },
            fromBlock: 0,
            toBlock: "latest",
        });
    } catch (err) {
        console.log({ err });
    }
    return result;
};

export {
    fromWei,
    toWei,
    getPastEvents,
    getAccount,
    getNetwork,
    getContractInstance,
    newInstance,
    getBalance,
};
