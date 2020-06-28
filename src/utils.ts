import { ethers, Contract, ContractInterface } from "ethers";

async function newContract(
    address: string,
    abi: ContractInterface,
    provider: ethers.Signer | ethers.providers.Provider
): Promise<Contract> {
    const contract: Contract = new ethers.Contract(address, abi, provider);
    return contract;
}
