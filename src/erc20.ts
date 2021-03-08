import ethers, { BigNumberish } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import ERC20 from '@primitivefi/contracts/artifacts/ERC20.json'
import TestERC20 from '@primitivefi/contracts/artifacts/TestERC20.json'
import Dai from '@primitivefi/v1-connectors/deployments/rinkeby/Dai.json'
import Weth9 from '@primitivefi/contracts/artifacts/WETH9.json'
import { STABLECOINS, WETH9 } from './constants'

export const mintTestTokens = async (
  signer: ethers.Signer,
  account: string
): Promise<ethers.Transaction[]> => {
  const amt: BigNumberish = parseEther('1000')
  try {
    let txs: any[] = []
    let erc20 = new ethers.Contract(
      STABLECOINS[4].address,
      TestERC20.abi,
      signer
    )
    let tx = await erc20.mint(account, amt)
    txs.push(tx)
    erc20 = new ethers.Contract(WETH9[4].address, Weth9.abi, signer)
    tx = await erc20.deposit({ value: amt })
    txs.push(tx)
    return txs
  } catch (error) {
    console.error(error)
  }
}

export const mintTestDai = async (
  signer: ethers.Signer,
  account: string
): Promise<ethers.Transaction> => {
  const amt: BigNumberish = parseEther('1000')
  let tx: ethers.Transaction
  try {
    let erc20 = new ethers.Contract(STABLECOINS[4].address, Dai.abi, signer)
    tx = await erc20.mint(account, amt)
  } catch (error) {
    console.error(`Error minting testnet dai ${error}`)
  }
  return tx
}

export const approve = async (
  signer: ethers.Signer,
  tokenAddress: string,
  account: string,
  spender: string
): Promise<ethers.Transaction> => {
  try {
    if (
      !ethers.utils.isAddress(tokenAddress) ||
      !ethers.utils.isAddress(account)
    ) {
      return null
    }
    const code: any = await signer.provider.getCode(tokenAddress)
    let tx: any
    if (code > 0) {
      const erc20 = new ethers.Contract(tokenAddress, ERC20.abi, signer)
      tx = await erc20.approve(spender, ethers.constants.MaxUint256)
    } else throw 'Approval Error'
    return tx
  } catch (error) {
    console.error(error)
  }
}

export const getBalance = async (
  provider: ethers.providers.Provider | ethers.providers.JsonRpcProvider,
  tokenAddress: string,
  account: string
): Promise<BigNumberish> => {
  try {
    if (
      !ethers.utils.isAddress(tokenAddress) ||
      !ethers.utils.isAddress(account)
    ) {
      return 0
    }
    const code: any = await provider.getCode(tokenAddress)
    let balance: BigNumberish = 0
    if (code > 0) {
      const erc20 = new ethers.Contract(tokenAddress, ERC20.abi, provider)
      balance = await erc20.balanceOf(account)
    }
    return balance
  } catch (error) {
    console.error(error)
  }
}

export const getTotalSupply = async (
  provider: ethers.providers.Provider | ethers.providers.JsonRpcProvider,
  tokenAddress: string
): Promise<BigNumberish> => {
  try {
    if (!ethers.utils.isAddress(tokenAddress)) {
      return 0
    }
    const code: any = await provider.getCode(tokenAddress)
    let balance: BigNumberish = 0
    if (code > 0) {
      const erc20 = new ethers.Contract(tokenAddress, ERC20.abi, provider)
      balance = await erc20.totalSupply()
    }
    return balance
  } catch (error) {
    console.error(error)
  }
}

export const getAllowance = async (
  provider: ethers.providers.Provider | ethers.providers.JsonRpcProvider,
  tokenAddress: string,
  account: string,
  spender: string
): Promise<BigNumberish> => {
  try {
    if (
      !ethers.utils.isAddress(tokenAddress) ||
      !ethers.utils.isAddress(account)
    ) {
      return 0
    }
    const code: any = await provider.getCode(tokenAddress)
    let allowance: BigNumberish = 0
    if (code > 0) {
      const erc20 = new ethers.Contract(tokenAddress, ERC20.abi, provider)
      allowance = await erc20.allowance(account, spender)
    }
    return allowance
  } catch (error) {
    throw Error(`Getting allowance issue: ${error}`)
  }
}
