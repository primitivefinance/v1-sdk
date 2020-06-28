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
exports.Trader = void 0;
var ethers_1 = require("ethers");
var web3_1 = require("./web3");
var PrimeTraderDeployed = require("../artifacts/trader.js");
var ERC20 = require("../artifacts/erc20.js");
var PrimeOption = require("../artifacts/PrimeOption.js");
var parseEther = ethers_1.ethers.utils.parseEther;
var TestMnemonic = process.env.TEST_MNEMONIC ? process.env.TEST_MNEMONIC : "";
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
            var trader, account, option, underlying, tokenU, mint, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract()];
                    case 1:
                        trader = _a.sent();
                        return [4 /*yield*/, web3_1.getAccount(this.signer)];
                    case 2:
                        account = _a.sent();
                        return [4 /*yield*/, getOptionInstance(this.signer, address)];
                    case 3:
                        option = _a.sent();
                        return [4 /*yield*/, option.tokenU()];
                    case 4:
                        underlying = _a.sent();
                        return [4 /*yield*/, getERC20Instance(this.signer, underlying)];
                    case 5:
                        tokenU = _a.sent();
                        return [4 /*yield*/, checkAllowance(this.signer, tokenU, trader.address, amount)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        _a.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, trader.safeMint(option.address, parseEther(amount.toString()), account)];
                    case 8:
                        mint = _a.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        err_1 = _a.sent();
                        console.log({ err: err_1 });
                        mint = {};
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/, mint];
                }
            });
        });
    };
    Trader.prototype.safeExercise = function (address, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var trader, account, option, tokenS, _a, _b, inTokenS, inTokenP, _c, _d, _e, _f, _g, exercise, err_2;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, this.contract()];
                    case 1:
                        trader = _h.sent();
                        return [4 /*yield*/, web3_1.getAccount(this.signer)];
                    case 2:
                        account = _h.sent();
                        return [4 /*yield*/, getOptionInstance(this.signer, address)];
                    case 3:
                        option = _h.sent();
                        _a = getERC20Instance;
                        _b = [this.signer];
                        return [4 /*yield*/, option.tokenS()];
                    case 4: return [4 /*yield*/, _a.apply(void 0, _b.concat([_h.sent()]))];
                    case 5:
                        tokenS = _h.sent();
                        return [4 /*yield*/, checkAllowance(this.signer, tokenS, trader.address, amount)];
                    case 6:
                        _h.sent();
                        return [4 /*yield*/, checkAllowance(this.signer, option, trader.address, amount)];
                    case 7:
                        _h.sent();
                        inTokenS = parseEther(amount.toString());
                        _c = Number;
                        _f = (_e = inTokenS).mul;
                        return [4 /*yield*/, option.base()];
                    case 8:
                        _g = (_d = _f.apply(_e, [_h.sent()])).div;
                        return [4 /*yield*/, option.price()];
                    case 9:
                        inTokenP = _c.apply(void 0, [_g.apply(_d, [_h.sent()])]);
                        _h.label = 10;
                    case 10:
                        _h.trys.push([10, 12, , 13]);
                        return [4 /*yield*/, trader.safeExercise(address, inTokenS.toString(), account)];
                    case 11:
                        exercise = _h.sent();
                        return [3 /*break*/, 13];
                    case 12:
                        err_2 = _h.sent();
                        console.error({ err: err_2 });
                        exercise = {};
                        return [3 /*break*/, 13];
                    case 13: return [2 /*return*/, exercise];
                }
            });
        });
    };
    Trader.prototype.safeRedeem = function (address, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var trader, account, option, tokenR, _a, _b, redeem, err_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.contract()];
                    case 1:
                        trader = _c.sent();
                        return [4 /*yield*/, web3_1.getAccount(this.signer)];
                    case 2:
                        account = _c.sent();
                        return [4 /*yield*/, getOptionInstance(this.signer, address)];
                    case 3:
                        option = _c.sent();
                        _a = getERC20Instance;
                        _b = [this.signer];
                        return [4 /*yield*/, option.tokenR()];
                    case 4: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent()]))];
                    case 5:
                        tokenR = _c.sent();
                        return [4 /*yield*/, checkAllowance(this.signer, tokenR, trader.address, amount)];
                    case 6:
                        _c.sent();
                        _c.label = 7;
                    case 7:
                        _c.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, trader.safeRedeem(address, parseEther(amount.toString()), account)];
                    case 8:
                        redeem = _c.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        err_3 = _c.sent();
                        console.log({ err: err_3 });
                        redeem = {};
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/, redeem];
                }
            });
        });
    };
    Trader.prototype.safeClose = function (address, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var trader, account, option, tokenR, _a, _b, close, err_4;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.contract()];
                    case 1:
                        trader = _c.sent();
                        return [4 /*yield*/, web3_1.getAccount(this.signer)];
                    case 2:
                        account = _c.sent();
                        return [4 /*yield*/, getOptionInstance(this.signer, address)];
                    case 3:
                        option = _c.sent();
                        _a = getERC20Instance;
                        _b = [this.signer];
                        return [4 /*yield*/, option.tokenR()];
                    case 4: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent()]))];
                    case 5:
                        tokenR = _c.sent();
                        return [4 /*yield*/, checkAllowance(this.signer, tokenR, trader.address, amount)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, checkAllowance(this.signer, option, trader.address, amount)];
                    case 7:
                        _c.sent();
                        _c.label = 8;
                    case 8:
                        _c.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, trader.safeClose(address, parseEther(amount.toString()), account)];
                    case 9:
                        close = _c.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        err_4 = _c.sent();
                        console.error({ err: err_4 });
                        close = {};
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/, close];
                }
            });
        });
    };
    return Trader;
}());
exports.Trader = Trader;
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var provider, signer, Alice, option, trader, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    provider = ethers_1.ethers.getDefaultProvider("rinkeby");
                    signer = ethers_1.ethers.Wallet.fromMnemonic(TestMnemonic);
                    return [4 /*yield*/, signer.connect(provider)];
                case 1:
                    Alice = _a.sent();
                    option = "0xf0481628ec335e0Cc0c0383866CfE88eE4a55c9D";
                    trader = new Trader(provider, Alice);
                    return [4 /*yield*/, trader.safeRedeem(option, 1)];
                case 2:
                    result = _a.sent();
                    console.log(result);
                    return [2 /*return*/];
            }
        });
    });
}
main();
