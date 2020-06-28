import { TOKENS_CONTEXT } from "./constants";

/**
 * @dev gets an address of an ERC-20 token stored locally
 * @param networkId the id of the currently connected network
 * @param symbol symbol of the token to get the address of
 */
const getTokenAddress = (networkId: number, symbol: string): string => {
    let token: any = TOKENS_CONTEXT[networkId][symbol];
    if (token?.address) {
        return token?.address;
    } else {
        return "";
    }
};

/**
 * @dev gets an abi of a locally saved ERC-20 token
 * @param networkId the id of the currently connected network
 * @param symbol symbol of the token to get the abi of
 */
const getTokenAbi = (networkId: number, symbol: string): any => {
    let token: any = TOKENS_CONTEXT[networkId][symbol];
    if (token?.address) {
        return token.abi;
    } else {
        return "";
    }
};

const ellipseAddress = (address: string): string => {
    let width: number = 5;
    let newAddress: string = `${address.slice(0, width)}...${address.slice(
        -width
    )}`;
    return newAddress;
};

/**
 * @dev parses a name
 * @notice example name: ETH200430C0015000DAI
 * @param {string} name the name to parse
 * @returns a parsed option name
 */
const parseOptionName = (name: string): string => {
    let width: number = 3;
    let underlying: string = name.slice(0, width);
    let type: string = name.slice(width + 6, width + 7);
    let strikePrice: string = name.slice(width + 9, width + 12);
    let strike: string = name.slice(-width);
    let newName: string = `${underlying + type + strikePrice + strike}`;
    return newName;
};

export { getTokenAddress, getTokenAbi, ellipseAddress, parseOptionName };
