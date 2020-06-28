"use strict";
/* import { getOptionAddress, getOptionInstanceWithAddress } from "./prime";
import { checkAllowance, getERC20Instance } from "./ERC20";
import { TOKENS_CONTEXT } from "./constants";
import { newInstance, getAccount, toWei, getNetwork } from "./web3";
import BN from "bn.js"; */
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
/* const PrimeTrader = require("@primitivefi/contracts/artifacts/PrimeTrader.json"); */
var PrimeTraderDeployed = require("../artifacts/trader.js");
var ERC20 = require("../artifacts/erc20.js");
var PrimeOption = require("../artifacts/PrimeOption.js");
var ethers_1 = require("ethers");
var web3_1 = require("./web3");
var parseEther = ethers_1.ethers.utils.parseEther;
var TestMnemonic = process.env.TEST_MNEMONIC ? process.env.TEST_MNEMONIC : "";
console.log("starting class");
var getERC20Instance = function (signer, address) { return __awaiter(void 0, void 0, void 0, function () {
    var contract;
    return __generator(this, function (_a) {
        contract = new ethers_1.ethers.Contract(address, ERC20.abi, signer);
        return [2 /*return*/, contract];
    });
}); };
var getOptionInstance = function (signer, address) { return __awaiter(void 0, void 0, void 0, function () {
    var contract;
    return __generator(this, function (_a) {
        contract = new ethers_1.ethers.Contract(address, PrimeOption.abi, signer);
        return [2 /*return*/, contract];
    });
}); };
var checkAllowance = function (owner, tokenU, spender, amount) { return __awaiter(void 0, void 0, void 0, function () {
    var allowance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, tokenU.allowance(owner.getAddress(), spender)];
            case 1:
                allowance = _a.sent();
                if (!(allowance <= amount)) return [3 /*break*/, 3];
                return [4 /*yield*/, tokenU.approve(spender, amount)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
var Trader = /** @class */ (function () {
    function Trader(provider, signer) {
        this.provider = provider;
        this.signer = signer;
    }
    Trader.prototype.contract = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contract, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = ethers_1.ethers.Contract).bind;
                        return [4 /*yield*/, this.address()];
                    case 1:
                        contract = new (_b.apply(_a, [void 0, _c.sent(), PrimeTraderDeployed.abi,
                            this.signer]))();
                        return [2 /*return*/, contract];
                }
            });
        });
    };
    Trader.prototype.address = function () {
        return __awaiter(this, void 0, void 0, function () {
            var chain, address;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.provider.getNetwork()];
                    case 1:
                        chain = _a.sent();
                        address = PrimeTraderDeployed.address;
                        return [2 /*return*/, address];
                }
            });
        });
    };
    Trader.prototype.safeMint = function (address, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var account, option, underlying, tokenU, _a, _b, mint, err_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, web3_1.getAccount(this.signer)];
                    case 1:
                        account = _c.sent();
                        return [4 /*yield*/, getOptionInstance(this.signer, address)];
                    case 2:
                        option = _c.sent();
                        return [4 /*yield*/, option.tokenU({ from: this.signer.getAddress() })];
                    case 3:
                        underlying = _c.sent();
                        return [4 /*yield*/, getERC20Instance(this.signer, underlying)];
                    case 4:
                        tokenU = _c.sent();
                        _a = checkAllowance;
                        _b = [this.signer, tokenU];
                        return [4 /*yield*/, this.address()];
                    case 5: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent(), amount]))];
                    case 6:
                        _c.sent();
                        _c.label = 7;
                    case 7:
                        _c.trys.push([7, 10, , 11]);
                        return [4 /*yield*/, this.contract()];
                    case 8: return [4 /*yield*/, (_c.sent()).safeMint(option.address, parseEther(amount.toString()), account)];
                    case 9:
                        mint = _c.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        err_1 = _c.sent();
                        console.log({ err: err_1 });
                        mint = {};
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/, mint];
                }
            });
        });
    };
    return Trader;
}());
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var provider, signer, Alice, trader, option, mint;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    provider = ethers_1.ethers.getDefaultProvider("rinkeby");
                    signer = ethers_1.ethers.Wallet.fromMnemonic(TestMnemonic);
                    return [4 /*yield*/, signer.connect(provider)];
                case 1:
                    Alice = _a.sent();
                    trader = new Trader(provider, Alice);
                    option = "0xf0481628ec335e0Cc0c0383866CfE88eE4a55c9D";
                    return [4 /*yield*/, trader.safeMint(option, 1)];
                case 2:
                    mint = _a.sent();
                    console.log(mint);
                    return [2 /*return*/];
            }
        });
    });
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
