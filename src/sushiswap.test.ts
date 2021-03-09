import {
  SUSHI_ROUTER_ADDRESS,
  PRIMITIVE_ROUTER,
  SWAPS,
  LIQUIDITY,
  WETH9,
} from './constants'
import { Trade } from './entities'
import isZero from './utils/isZero'
import getParams from './utils/getParams'
import { TokenAmount } from '@sushiswap/sdk'
import { parseEther } from 'ethers/lib/utils'
import { Operation, STABLECOINS, Venue } from './constants'
import { TradeSettings, SinglePositionParameters } from './types'
import ethers, { BigNumberish, BigNumber, Contract } from 'ethers'
import UniswapV2Router02 from '@uniswap/v2-periphery/build/UniswapV2Router02.json'
import { SushiSwap } from './sushiswap'

const decode = (contract: Contract, method: string, data: string) => {
  return contract.interface.decodeFunctionData(method, data)
}

describe('Sushiswap', () => {
  it('returns fn params', () => {
    let option = '0xe17D3CdC8f0bcC6C36DEFe69DF477061a909eeDA'
    let input = '1000000000000000000'
    let amtB = '900000000000000000'
    let amtBMin = '1600000000000000000000'
    let deadline = '2400'

    let fn = 'addShortLiquidityWithETH'
    let fnArgs = [
      option,
      input, // make sure this isnt amountADesired, amountADesired is the quantity for the internal function
      amtB,
      amtBMin,
      deadline,
    ]
    let value = BigNumber.from(input).add(amtB).toString()
    const Liquidity = new Contract(LIQUIDITY[4].address, LIQUIDITY[4].abi)
    const PrimitiveRouter: Contract = new Contract(
      PRIMITIVE_ROUTER[4].address,
      PRIMITIVE_ROUTER[4].abi
    )

    let params = getParams(Liquidity, fn, fnArgs)
    console.log({ params })
    let decoded = Liquidity.interface.decodeFunctionData(
      'addShortLiquidityWithUnderlying',
      '0xdfaa35cc000000000000000000000000f7ceca0e43c24b8385f00aa1e1529ae35ddb50560000000000000000000000000000000000000000000000056bc75e2d63100000000000000000000000000000000000000000000000000004e1003b28d9280000000000000000000000000000000000000000000000000004d482c9ed8f4e0000000000000000000000000000000000000000000000000000000000006045aa43'
    )
    let data =
      '0x2da318c1000000000000000000000000f7ceca0e43c24b8385f00aa1e1529ae35ddb50560000000000000000000000000000000000000000000000056bc75e2d63100000000000000000000000000000000000000000000000000004e1003b28d9280000000000000000000000000000000000000000000000000004d482c9ed8f4e00000000000000000000000000000000000000000000000000000000000060465391000000000000000000000000000000000000000000000000000000000000001c9eecd380a88c49b151d092db621f3dbcba08e028a7a137af9c9e3595ff95d94c76bb2193f8ed8b784388dcedaf01e68737467d37b153260ddb24bfd8d97650b1'
    console.log(decoded.map((data) => data.toString()))
    console.log(
      decode(Liquidity, 'addShortLiquidityDAIWithPermit', data).map((item) =>
        item.toString()
      )
    )
  })
})
