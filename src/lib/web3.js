"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getBalance = exports.newInstance = exports.getContractInstance = exports.getNetwork = exports.getAccount = exports.getPastEvents = exports.toWei = exports.fromWei = void 0;
var ethers_1 = require("ethers");
//import { getTokenAddress, getTokenAbi } from "./utils";
/**
 * @dev converts a number from 10^18 decimal places
 * @param {number} weiAmount a string amount to convert from 10^18 decimals
 * @returns a number that is 10^-18
 */
var fromWei = function (weiAmount) {
    var fromWeiAmount = ethers_1.ethers.utils.parseEther(weiAmount.toString()).toString();
    return fromWeiAmount;
};
exports.fromWei = fromWei;
/**
 * @dev converts a number to 10^18 decimal places
 * @param {number} amount a string amount to convert to 10^18 decimals
 * @returns a number that has 10^18 decimal places
 */
var toWei = function (amount) {
    var toWeiAmount = ethers_1.ethers.utils.parseEther(amount.toString()).toString();
    return toWeiAmount;
};
exports.toWei = toWei;
var getBalance = function (signer) { return __awaiter(void 0, void 0, void 0, function () {
    var account, balance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getAccount(signer)];
            case 1:
                account = _a.sent();
                return [4 /*yield*/, signer.getBalance(account)];
            case 2:
                balance = _a.sent();
                return [2 /*return*/, balance];
        }
    });
}); };
exports.getBalance = getBalance;
/**
 * @dev gets the connected account address
 * @param signer
 * @returns address of account
 */
var getAccount = function (signer) { return __awaiter(void 0, void 0, void 0, function () {
    var account;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, signer.getAddress()];
            case 1:
                account = _a.sent();
                return [2 /*return*/, account];
        }
    });
}); };
exports.getAccount = getAccount;
/**
 * @dev gets the currently connected network Id
 * @returns networkId
 */
var getNetwork = function (provider) { return __awaiter(void 0, void 0, void 0, function () {
    var network, networkId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!provider) return [3 /*break*/, 2];
                return [4 /*yield*/, provider.getNetwork()];
            case 1:
                network = _a.sent();
                networkId = 1;
                return [2 /*return*/, networkId];
            case 2: return [2 /*return*/, 0];
        }
    });
}); };
exports.getNetwork = getNetwork;
/**
 * @dev gets an Instance from a JSON artifact
 * @param contract a local JSON artifact of the contract
 * @returns an instance of the contract
 */
var getContractInstance = function (provider, signer, contract) { return __awaiter(void 0, void 0, void 0, function () {
    var networkId, deployedNetwork, instance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getNetwork(provider)];
            case 1:
                networkId = _a.sent();
                return [4 /*yield*/, contract.networks[networkId]];
            case 2:
                deployedNetwork = _a.sent();
                if (!deployedNetwork) {
                    console.log("Network Undefined");
                    return [2 /*return*/];
                }
                instance = new ethers_1.ethers.Contract(deployedNetwork === null || deployedNetwork === void 0 ? void 0 : deployedNetwork.address, contract.abi, signer);
                return [2 /*return*/, instance];
        }
    });
}); };
exports.getContractInstance = getContractInstance;
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
var newInstance = function (signer, abi, address) { return __awaiter(void 0, void 0, void 0, function () {
    var instance;
    return __generator(this, function (_a) {
        instance = new ethers_1.ethers.Contract(address, abi, signer);
        return [2 /*return*/, instance];
    });
}); };
exports.newInstance = newInstance;
/**
 * @dev Gets past events from a contract.
 * @param instance A contract instance.
 * @param event An event to get
 */
var getPastEvents = function (provider, signer, instance, event) { return __awaiter(void 0, void 0, void 0, function () {
    var account, result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getAccount(signer)];
            case 1:
                account = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, instance.getPastEvents(event, {
                        filter: { from: account },
                        fromBlock: 0,
                        toBlock: "latest"
                    })];
            case 3:
                result = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                console.log({ err: err_1 });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/, result];
        }
    });
}); };
exports.getPastEvents = getPastEvents;
