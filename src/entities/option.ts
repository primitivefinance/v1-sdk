import ethers, { BigNumberish, BigNumber } from 'ethers'
import OptionArtifact from '@primitivefi/contracts/artifacts/Option.json'
import { formatEther, parseEther } from 'ethers/lib/utils'
import { ChainId, Token, TokenAmount } from '@uniswap/sdk'
import * as UniswapSDK from '@uniswap/sdk'
import * as SushiSwapSDK from '@sushiswap/sdk'
import { STABLECOINS, ADDRESS_ZERO } from '../constants'
import isZero from '../utils/isZero'
import { WETH9 } from '../constants'

export interface OptionParameters {
  base: UniswapSDK.TokenAmount | SushiSwapSDK.TokenAmount
  quote: UniswapSDK.TokenAmount | SushiSwapSDK.TokenAmount
  expiry: number
}

export const EMPTY_ASSET: Token = new Token(1, ADDRESS_ZERO, 18)
export const EMPTY_TOKEN_AMOUNT:
  | UniswapSDK.TokenAmount
  | SushiSwapSDK.TokenAmount = new TokenAmount(EMPTY_ASSET, '')
export const EMPTY_OPTION_PARAMETERS: OptionParameters = {
  base: EMPTY_TOKEN_AMOUNT,
  quote: EMPTY_TOKEN_AMOUNT,
  expiry: 0,
}

export const createOptionEntityWithAddress = (
  chainId: number,
  optionAddress: string
) => {
  return new Option(
    EMPTY_OPTION_PARAMETERS,
    chainId,
    optionAddress,
    18,
    'Primitive V1 Option',
    'PRM'
  )
}

/**
 * Represents a Primitive V1 Option.
 */
export class Option extends Token {
  public readonly optionParameters: OptionParameters
  public tokenAddresses: string[]
  public pair: UniswapSDK.Pair | SushiSwapSDK.Pair
  public constructor(
    optionParameters: OptionParameters,
    chainId: number,
    address: string,
    decimals: number,
    name?: string,
    symbol?: string
  ) {
    super(chainId, address, decimals, name, symbol)
    this.optionParameters = optionParameters
  }

  public setTokenAddresses(assets) {
    this.tokenAddresses = assets
  }

  public optionInstance(signer): ethers.Contract {
    return new ethers.Contract(this.address, OptionArtifact.abi, signer)
  }

  public get uniswapPairAddress(): string {
    const address: string = UniswapSDK.Pair.getAddress(
      this.underlying,
      this.redeem
    )
    return address
  }

  public get sushiswapPairAddress(): string {
    const address: string = SushiSwapSDK.Pair.getAddress(
      this.underlying,
      this.redeem
    )
    return address
  }

  public setPair(pair: UniswapSDK.Pair | SushiSwapSDK.Pair) {
    this.pair = pair
  }

  public get underlying(): UniswapSDK.Token | SushiSwapSDK.Token {
    return this.optionParameters.base.token
  }

  public get strike(): UniswapSDK.Token | SushiSwapSDK.Token {
    return this.optionParameters.quote.token
  }

  public get baseValue(): UniswapSDK.TokenAmount | SushiSwapSDK.TokenAmount {
    return this.optionParameters.base
  }

  public get quoteValue(): UniswapSDK.TokenAmount | SushiSwapSDK.TokenAmount {
    return this.optionParameters.quote
  }

  public get expiryValue(): number {
    return this.optionParameters.expiry
  }

  public get redeem(): UniswapSDK.Token | SushiSwapSDK.Token {
    return new Token(
      this.chainId,
      this.tokenAddresses[2],
      18,
      'RDM',
      'Primitive V1 Redeem'
    )
  }

  public get strikePrice(): string {
    const baseValue = this.baseValue.raw.toString()
    const quoteValue = this.quoteValue.raw.toString()
    const numerator = BigNumber.from(quoteValue)
    const denominator = BigNumber.from(baseValue)
    let strikePrice: string
    if (parseEther('1').eq(baseValue)) {
      strikePrice = (parseInt(quoteValue) / parseInt(baseValue)).toString()
    } else if (parseEther('1').eq(quoteValue)) {
      strikePrice = (parseInt(baseValue) / parseInt(quoteValue)).toString()
    } else {
      if (isZero(denominator)) return '0'

      const strike =
        parseInt(numerator.toString()) / parseInt(denominator.toString())

      strikePrice = strike.toString()
    }

    return strikePrice
  }

  public proportionalLong(quantityShort: BigNumberish): BigNumber {
    const numerator = this.baseValue.raw.toString()
    const denominator = this.quoteValue.raw.toString()
    if (isZero(denominator)) return BigNumber.from('0')
    const long = BigNumber.from(quantityShort).mul(numerator).div(denominator)
    return long
  }

  public proportionalShort(quantityLong: BigNumberish): BigNumber {
    const numerator = this.quoteValue.raw.toString()
    const denominator = this.baseValue.raw.toString()
    if (isZero(denominator)) return BigNumber.from('0')
    const short = BigNumber.from(quantityLong).mul(numerator).div(denominator)
    return short
  }

  public getBreakeven(premiumWei: BigNumber): BigNumber {
    let breakeven: BigNumber
    if (this.isCall) {
      breakeven = premiumWei.add(parseEther(this.strikePrice))
    } else {
      breakeven = parseEther(this.strikePrice).sub(premiumWei)
    }
    return breakeven
  }

  public get isCall(): boolean {
    const baseValue = this.baseValue.raw.toString()
    const quoteValue = this.quoteValue.raw.toString()
    let isCall = false
    if (+formatEther(baseValue) === 1) {
      if (+formatEther(quoteValue) === 1) {
        if (this.isMainnet) {
          if (this.strike.address === STABLECOINS[this.chainId].address) {
            isCall = true
          }
        }
        const quoteToken = this.strike.symbol
        if (quoteToken.toUpperCase() === STABLECOINS[this.chainId].symbol) {
          isCall = true
        }
      } else {
        isCall = true
      }
    }
    return isCall
  }

  public get isPut(): boolean {
    const quoteValue = this.quoteValue.raw.toString()
    const baseValue = this.baseValue.raw.toString()
    let isPut = false
    if (+formatEther(quoteValue) === 1) {
      if (+formatEther(baseValue) === 1) {
        if (this.isMainnet) {
          if (this.underlying.address === STABLECOINS[this.chainId].address) {
            isPut = true
          }
        }
        const baseToken = this.strike.symbol
        if (baseToken === STABLECOINS[this.chainId].symbol) {
          isPut = true
        }
      } else {
        isPut = true
      }
    }
    return isPut
  }

  public get isWethCall(): boolean {
    return this.isCall
      ? this.underlying.address == WETH9[this.chainId].address
        ? true
        : false
      : false
  }

  public get isWethPut(): boolean {
    return this.isPut
      ? this.strike.address == WETH9[this.chainId].address
        ? true
        : false
      : false
  }

  public get isMainnet(): boolean {
    return this.chainId === ChainId.MAINNET
  }

  public getTimeToExpiry(): number {
    const expiry: number = this.expiryValue * 1000
    const now: number = new Date().valueOf()
    const milisecondsInYear = 60 * 60 * 24 * 365 * 1000
    const timeLeft: number = (expiry - now) / milisecondsInYear
    return timeLeft
  }
}
