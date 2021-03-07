import { Operation, Venue } from './constants'
import { Trade } from './entities'
import ethers, { BigNumberish, BigNumber, Contract } from 'ethers'
import {
  UNI_ROUTER_ADDRESS,
  SUSHI_ROUTER_ADDRESS,
  SUSHISWAP_CONNECTOR,
  UNISWAP_CONNECTOR,
} from './constants'
import UniswapV2Router02 from '@uniswap/v2-periphery/build/UniswapV2Router02.json'
import SushiSwapConnector from '@primitivefi/v1-connectors/deployments/live/UniswapConnector03.json'
import { TradeSettings, SinglePositionParameters } from './types'
import { parseEther } from 'ethers/lib/utils'
import isZero from './utils/isZero'
import { TokenAmount } from '@sushiswap/sdk'

export const getParams = (
  instance: Contract,
  method: string,
  args: any[]
): any => {
  return instance.interface.encodeFunctionData(method, args)
}

/**
 * Represents the UniswapConnector contract.
 */
export class SushiSwap {
  private constructor() {}

  public static singlePositionCallParameters(
    trade: Trade,
    tradeSettings: TradeSettings
  ): SinglePositionParameters {
    const venue = trade.venue
    const chainId = trade.option.chainId
    let connectorAddress: string
    let routerAddress: string

    switch (venue) {
      case Venue.UNISWAP:
        connectorAddress = UNISWAP_CONNECTOR[chainId]
        routerAddress = UNI_ROUTER_ADDRESS
        break
      case Venue.SUSHISWAP:
        connectorAddress = SUSHISWAP_CONNECTOR[chainId]
        routerAddress = SUSHI_ROUTER_ADDRESS
        break
      default:
        connectorAddress = SUSHISWAP_CONNECTOR[chainId]
        routerAddress = SUSHI_ROUTER_ADDRESS
        break
    }

    let contract: ethers.Contract
    let methodName: string
    let args: (string | string[])[]
    let value: string

    let amountIn: string
    let amountOut: string
    let amountADesired: string | BigNumber | TokenAmount
    let amountBDesired: string | BigNumber
    let amountAMin: string | BigNumber
    let amountBMin: string | BigNumber
    let path: string[]
    let minPayout

    const router: Contract = new ethers.Contract(
      routerAddress,
      UniswapV2Router02.abi, // FIX
      trade.signer
    )
    const method: string = 'executeCall'

    const deadline =
      tradeSettings.timeLimit > 0
        ? (
            Math.floor(new Date().getTime() / 1000) + tradeSettings.timeLimit
          ).toString()
        : tradeSettings.deadline.toString()
    const to: string = tradeSettings.receiver

    const RouterContract = new ethers.Contract(
      routerAddress,
      UniswapV2Router02.abi,
      trade.signer
    )

    const ConnectorContract = new ethers.Contract(
      connectorAddress,
      SushiSwapConnector.abi,
      trade.signer
    )

    const Core = new ethers.Contract(
      connectorAddress,
      SushiSwapConnector.abi,
      trade.signer
    )

    const Swaps = new ethers.Contract(
      connectorAddress,
      SushiSwapConnector.abi,
      trade.signer
    )

    const Liquidity = new ethers.Contract(
      connectorAddress,
      SushiSwapConnector.abi,
      trade.signer
    )

    const inputAmount: TokenAmount = trade.inputAmount
    const outputAmount: TokenAmount = trade.outputAmount

    switch (trade.operation) {
      case Operation.LONG:
        let premium: BigNumberish = trade.calcMaximumInSlippage(
          trade.openPremium.raw.toString(),
          tradeSettings.slippage
        )
        let params: string = ''
        if (trade.option.isWethCall) {
          let fn = 'openFlashLongWithETH'
          let fnArgs = [trade.option.address, outputAmount.raw.toString()]
          params = getParams(Swaps, fn, fnArgs)
          value = premium.toString()
        } else {
          let fn = 'openFlashLong'
          let fnArgs = [
            trade.option.address,
            outputAmount.raw.toString(),
            premium.toString(),
          ]
          params = getParams(Swaps, fn, fnArgs)
          value = '0'
        }
        contract = router // calls the router's `executeCall` function with the encoded params.
        methodName = 'executeCall'
        args = [Swaps.address, params]
        break
      case Operation.SHORT:
        let amountInMax = trade
          .maximumAmountIn(tradeSettings.slippage)
          .raw.toString()
        path = [
          trade.inputAmount.token.address,
          trade.outputAmount.token.address,
        ]
        contract = RouterContract
        methodName = 'swapTokensForExactTokens'
        args = [
          trade.outputAmount.raw.toString(),
          amountInMax,
          path,
          to,
          deadline,
        ]
        value = '0'
        break
      case Operation.CLOSE_LONG:
        minPayout = trade.closePremium.raw.toString()
        if (BigNumber.from(minPayout).lte(0) || isZero(minPayout)) {
          minPayout = '1'
        }

        contract = ConnectorContract
        methodName = 'closeFlashLong'
        args = [
          trade.option.address,
          trade.outputAmount.raw.toString(),
          minPayout.toString(), // IMPORTANT: IF THIS VALUE IS 0, IT WILL COST THE USER TO CLOSE (NEGATIVE PAYOUT)
        ]
        value = '0'
        break
      case Operation.CLOSE_SHORT:
        // Just purchase redeemTokens from a redeem<>underlying token pair
        amountIn = trade.maximumAmountIn(tradeSettings.slippage).raw.toString()
        const amountOutMin = trade
          .minimumAmountOut(tradeSettings.slippage)
          .raw.toString()
        path = [
          trade.inputAmount.token.address,
          trade.outputAmount.token.address,
        ]
        contract = RouterContract
        methodName = 'swapExactTokensForTokens'
        args = [amountIn, amountOutMin, path, to, deadline]
        value = '0'
        break
      case Operation.ADD_LIQUIDITY:
        const redeemReserves = trade.market.reserveOf(trade.option.redeem)
        const underlyingReserves = trade.market.reserveOf(
          trade.option.underlying
        )
        const hasLiquidity = trade.market.hasLiquidity
        const denominator = !hasLiquidity
          ? 0
          : BigNumber.from(trade.option.quoteValue.raw.toString())
              .mul(parseEther('1'))
              .div(trade.option.baseValue.raw.toString())
              .mul(underlyingReserves.raw.toString())
              .div(redeemReserves.raw.toString())
              .add(parseEther('1'))
        const optionsInput = isZero(denominator)
          ? BigNumber.from(inputAmount.raw.toString())
          : BigNumber.from(inputAmount.raw.toString())
              .mul(parseEther('1'))
              .div(denominator)

        // amount of redeems that will be minted and added to the pool
        amountADesired = new TokenAmount(
          trade.option.redeem,
          trade.option.proportionalShort(optionsInput).toString()
        )

        if (!hasLiquidity) {
          amountBDesired = trade.outputAmount.raw.toString()
        } else {
          amountBDesired = Trade.getQuote(
            amountADesired.raw.toString(),
            trade.market.reserveOf(amountADesired.token).raw.toString(),
            trade.market.reserveOf(trade.option.underlying).raw.toString()
          ).toString()
        }
        amountBMin = trade.calcMinimumOutSlippage(
          amountBDesired,
          tradeSettings.slippage
        )
        contract = ConnectorContract
        methodName = 'addShortLiquidityWithUnderlying'
        args = [
          trade.option.address,
          optionsInput.toString(), // make sure this isnt amountADesired, amountADesired is the quantity for the internal function
          amountBDesired.toString(),
          amountBMin.toString(),
          to,
          deadline,
        ]
        value = '0'
        break
      case Operation.ADD_LIQUIDITY_CUSTOM:
        // amount of redeems that will be minted and added to the pool
        amountADesired = inputAmount.raw.toString()
        amountBDesired = trade.outputAmount.raw.toString()
        amountAMin = trade.calcMinimumOutSlippage(
          amountADesired,
          tradeSettings.slippage
        )
        amountBMin = trade.calcMinimumOutSlippage(
          amountBDesired,
          tradeSettings.slippage
        )
        contract = RouterContract
        methodName = 'addLiquidity'
        args = [
          trade.inputAmount.token.address,
          trade.outputAmount.token.address,
          trade.inputAmount.raw.toString(),
          trade.outputAmount.raw.toString(),
          amountAMin.toString(),
          amountBMin.toString(),
          to,
          deadline,
        ]
        value = '0'
        break
      case Operation.REMOVE_LIQUIDITY:
        amountAMin = isZero(trade.totalSupply)
          ? BigNumber.from('0')
          : BigNumber.from(inputAmount.raw.toString())
              .mul(trade.market.reserveOf(inputAmount.token).raw.toString())
              .div(trade.totalSupply)
        amountBMin = isZero(trade.totalSupply)
          ? BigNumber.from('0')
          : BigNumber.from(inputAmount.raw.toString())
              .mul(trade.market.reserveOf(outputAmount.token).raw.toString())
              .div(trade.totalSupply)

        amountAMin = trade.calcMinimumOutSlippage(
          amountAMin.toString(),
          tradeSettings.slippage
        )
        amountBMin = trade.calcMinimumOutSlippage(
          amountBMin.toString(),
          tradeSettings.slippage
        )
        contract = RouterContract
        methodName = 'removeLiquidity'
        args = [
          trade.inputAmount.token.address,
          trade.outputAmount.token.address,
          trade.inputAmount.raw.toString(),
          amountAMin.toString(),
          amountBMin.toString(),
          to,
          deadline,
        ]
        value = '0'
        break
      case Operation.REMOVE_LIQUIDITY_CLOSE:
        const redeemToken = trade.option.redeem
        const underlyingToken = trade.option.underlying
        const redeemReserve = trade.market.reserveOf(redeemToken)
        const underlyingReserve = trade.market.reserveOf(underlyingToken)
        // should always be redeem
        amountAMin = isZero(trade.totalSupply)
          ? BigNumber.from('0')
          : BigNumber.from(inputAmount.raw.toString())
              .mul(redeemReserve.raw.toString())
              .div(trade.totalSupply)
        // should always be underlying
        amountBMin = isZero(trade.totalSupply)
          ? BigNumber.from('0')
          : BigNumber.from(inputAmount.raw.toString())
              .mul(underlyingReserve.raw.toString())
              .div(trade.totalSupply)

        amountAMin = trade.calcMinimumOutSlippage(
          amountAMin.toString(),
          tradeSettings.slippage
        )
        amountBMin = trade.calcMinimumOutSlippage(
          amountBMin.toString(),
          tradeSettings.slippage
        )
        contract = ConnectorContract
        methodName = 'removeShortLiquidityThenCloseOptions'
        args = [
          trade.option.address,
          trade.inputAmount.raw.toString(),
          amountAMin.toString(),
          amountBMin.toString(),
          to,
          deadline,
        ]
        value = '0'
        break
    }

    return {
      contract,
      methodName,
      args,
      value,
    }
  }
}
