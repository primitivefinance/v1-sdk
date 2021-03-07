import { Contract } from 'ethers'
const getParams = (instance: Contract, method: string, args: any[]): any => {
  return instance.interface.encodeFunctionData(method, args)
}

export default getParams
