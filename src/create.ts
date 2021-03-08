import ethers, { Contract } from 'ethers'
import { SUSHI_FACTORY_ADDRESS, PRIMITIVE_ROUTER } from './constants'
import OptionABI from '@primitivefi/contracts/artifacts/Option.json'
import UniswapV2Factory from '@uniswap/v2-core/build/UniswapV2Factory.json'
import UniswapV2Pair from '@uniswap/v2-core/build/UniswapV2Pair.json'

export const createMarket = async (
  signer: ethers.Signer,
  optionAddress: string
): Promise<Contract> => {
  const chainId = await signer.getChainId()
  const option: Contract = new Contract(optionAddress, OptionABI.abi, signer)
  let under: string
  let redeem: string
  try {
    under = await option.getUnderlyingTokenAddress()
    redeem = await option.redeemToken()
  } catch (err) {
    console.log(`Throwing when fetching under and redeem ${err}`)
  }

  const factory: Contract = new Contract(
    SUSHI_FACTORY_ADDRESS[chainId],
    UniswapV2Factory.abi,
    signer
  )
  let pairAddress: string
  let pair: Contract
  try {
    pairAddress = await factory.getPair(under, redeem)
    if (pairAddress === ethers.constants.AddressZero) {
      await factory.createPair(under, redeem)
      pairAddress = await factory.getPair(under, redeem)
      pair = new Contract(pairAddress, UniswapV2Pair.abi, signer)
    }
  } catch (err) {
    console.log(`Throwing when fetching pair ${err}`)
  }

  return pair
}

export const registerOptions = async (
  signer: ethers.Signer,
  optionAddresses: string[]
): Promise<ethers.Transaction> => {
  const chainId = await signer.getChainId()
  const router: Contract = new Contract(
    PRIMITIVE_ROUTER[chainId].address,
    PRIMITIVE_ROUTER[chainId].abi,
    signer
  )
  let tx: ethers.Transaction
  try {
    tx = await router.setRegisteredOptions(optionAddresses)
  } catch (err) {
    console.log(`Throwing when registering option ${optionAddresses} ${err}`)
  }
  return tx
}

export const registerConnectors = async (
  signer: ethers.Signer,
  connectors: string[],
  isValid: boolean[]
): Promise<ethers.Transaction> => {
  const chainId = await signer.getChainId()
  const router: Contract = new Contract(
    PRIMITIVE_ROUTER[chainId].address,
    PRIMITIVE_ROUTER[chainId].abi,
    signer
  )
  let tx: ethers.Transaction
  try {
    tx = await router.setRegisteredConnectors(connectors, isValid)
  } catch (err) {
    console.log(`Throwing when registering option ${connectors} ${err}`)
  }
  return tx
}
