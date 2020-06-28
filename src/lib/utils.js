"use strict";
exports.__esModule = true;
exports.parseOptionName = exports.ellipseAddress = exports.getTokenAbi = exports.getTokenAddress = void 0;
var constants_1 = require("./constants");
/**
 * @dev gets an address of an ERC-20 token stored locally
 * @param networkId the id of the currently connected network
 * @param symbol symbol of the token to get the address of
 */
var getTokenAddress = function (networkId, symbol) {
    var token = constants_1.TOKENS_CONTEXT[networkId][symbol];
    if (token === null || token === void 0 ? void 0 : token.address) {
        return token === null || token === void 0 ? void 0 : token.address;
    }
    else {
        return "";
    }
};
exports.getTokenAddress = getTokenAddress;
/**
 * @dev gets an abi of a locally saved ERC-20 token
 * @param networkId the id of the currently connected network
 * @param symbol symbol of the token to get the abi of
 */
var getTokenAbi = function (networkId, symbol) {
    var token = constants_1.TOKENS_CONTEXT[networkId][symbol];
    if (token === null || token === void 0 ? void 0 : token.address) {
        return token.abi;
    }
    else {
        return "";
    }
};
exports.getTokenAbi = getTokenAbi;
var ellipseAddress = function (address) {
    var width = 5;
    var newAddress = address.slice(0, width) + "..." + address.slice(-width);
    return newAddress;
};
exports.ellipseAddress = ellipseAddress;
/**
 * @dev parses a name
 * @notice example name: ETH200430C0015000DAI
 * @param {string} name the name to parse
 * @returns a parsed option name
 */
var parseOptionName = function (name) {
    var width = 3;
    var underlying = name.slice(0, width);
    var type = name.slice(width + 6, width + 7);
    var strikePrice = name.slice(width + 9, width + 12);
    var strike = name.slice(-width);
    var newName = "" + (underlying + type + strikePrice + strike);
    return newName;
};
exports.parseOptionName = parseOptionName;
