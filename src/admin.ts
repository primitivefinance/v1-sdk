import ethers, { Contract } from 'ethers'
import { PRIMITIVE_ROUTER } from './constants'

export const halt = async (
  signer: ethers.Signer
): Promise<ethers.Transaction> => {
  const chainId = await signer.getChainId()
  const router: Contract = new Contract(
    PRIMITIVE_ROUTER[chainId].address,
    PRIMITIVE_ROUTER[chainId].abi,
    signer
  )
  let tx: ethers.Transaction
  try {
    tx = await router.halt()
  } catch (err) {
    console.log(`Throw when halting ${err}`)
  }
  return tx
}
