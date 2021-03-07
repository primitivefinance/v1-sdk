import ethers from 'ethers'
import { Trade } from './entities'
import getParams from './utils/getParams'
import { TradeSettings, SinglePositionParameters } from './types'
import { Operation, CORE, PRIMITIVE_ROUTER, TRADER } from './constants'

/**
 * Represents the Primitive V1 Trader contract.
 */
export class Trader {
  private constructor() {}

  public static singleOperationCallParameters(
    trade: Trade,
    tradeSettings: TradeSettings
  ): SinglePositionParameters {
    const chainId: number = trade.option.chainId
    const PrimitiveRouter: ethers.Contract = new ethers.Contract(
      PRIMITIVE_ROUTER[chainId].address,
      PRIMITIVE_ROUTER[chainId].abi,
      trade.signer
    )
    const Trader: ethers.Contract = new ethers.Contract(
      TRADER[chainId].address,
      TRADER[chainId].abi,
      trade.signer
    )
    const Core = new ethers.Contract(
      CORE[chainId].address,
      CORE[chainId].abi,
      trade.signer
    )

    let contract: ethers.Contract = Trader
    let methodName: string
    let args: (string | string[])[]
    let value: string

    const optionAddress: string = trade.option.address
    const amountIn: string = trade.inputAmount.raw.toString()
    const to: string = tradeSettings.receiver

    const isWethCall = trade.option.isWethCall
    const isWethPut = trade.option.isWethPut

    let params: string = ''
    switch (trade.operation) {
      case Operation.MINT:
        // Mint options through the Trader Library (inherited by Trader and WethConnectorArtifact).

        if (isWethCall) {
          let fn = 'safeMintWithETH'
          let args = [optionAddress]
          params = getParams(Core, fn, args)
          contract = PrimitiveRouter
          methodName = 'executeCall'
          args = [Core.address, params]
          value = amountIn
        } else if (trade.signitureData !== null) {
          let fn = 'safeMintWithPermit'
          let args = [
            optionAddress,
            amountIn,
            trade.signitureData.deadline,
            trade.signitureData.v,
            trade.signitureData.r,
            trade.signitureData.s,
          ]
          params = getParams(Core, fn, args)
          contract = PrimitiveRouter
          methodName = 'executeCall'
          args = [Core.address, params]
          value = '0'
        } else {
          methodName = 'safeMint'
          args = [optionAddress, amountIn, to]
          value = '0'
        }
        break
      case Operation.EXERCISE:
        // Exercise options through the Trader Library (inherited by Trader and WethConnectorArtifact).

        if (isWethPut) {
          let fn = 'safeExerciseWithETH'
          let args = [optionAddress]
          params = getParams(Core, fn, args)
          contract = PrimitiveRouter
          methodName = 'executeCall'
          args = [Core.address, params]
          value = amountIn
        } else if (isWethCall) {
          let fn = 'safeMintForETH'
          let args = [optionAddress, amountIn]
          params = getParams(Core, fn, args)
          contract = PrimitiveRouter
          methodName = 'executeCall'
          args = [Core.address, params]
          value = '0'
        } else {
          methodName = 'safeExercise'
          args = [optionAddress, amountIn, to]
          value = '0'
        }
        break
      case Operation.REDEEM:
        // Exercise options through the Trader Library (inherited by Trader and WethConnectorArtifact).

        if (isWethCall) {
          let fn = 'safeRedeemForETH'
          let args = [optionAddress, amountIn]
          params = getParams(Core, fn, args)
          contract = PrimitiveRouter
          methodName = 'executeCall'
          args = [Core.address, params]
          value = '0'
        } else {
          methodName = 'safeRedeem'
        }
        args = [optionAddress, amountIn, to]
        value = '0'
        break
      case Operation.CLOSE:
        // Exercise options through the Trader Library (inherited by Trader and WethConnectorArtifact).

        if (isWethCall) {
          let fn = 'safeCloseForETH'
          let args = [optionAddress, amountIn]
          params = getParams(Core, fn, args)
          contract = PrimitiveRouter
          methodName = 'executeCall'
          args = [Core.address, params]
          value = '0'
        } else {
          if (trade.option.getTimeToExpiry() <= 0) {
            methodName = 'safeUnwind'
          } else {
            methodName = 'safeClose'
          }
        }
        args = [optionAddress, amountIn, to]
        value = '0'
        break
      case Operation.UNWIND:
        // Exercise options through the Trader Library (inherited by Trader and WethConnectorArtifact).

        if (isWethCall) {
          let fn = 'safeCloseForETH'
          let args = [optionAddress, amountIn]
          params = getParams(Core, fn, args)
          contract = PrimitiveRouter
          methodName = 'executeCall'
          args = [Core.address, params]
          value = '0'
        } else {
          methodName = 'safeUnwind'
        }
        args = [optionAddress, amountIn, to]
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
