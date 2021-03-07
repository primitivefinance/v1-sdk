/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BigNumber } from '@ethersproject/bignumber'

export type Address = string

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ABI = any[] // TODO abi

export type Log = {
  blockNumber: number
  blockHash: string
  transactionHash: string
  transactionIndex: number
  logIndex: number
  removed: boolean
  address: string
  topics: string[]
  data: string
}

export type Receipt = {
  from: Address
  transactionHash: string
  blockHash: string
  blockNumber: number
  transactionIndex: number
  cumulativeGasUsed: BigNumber | string | number
  gasUsed: BigNumber | string | number
  contractAddress?: string
}

export type DiamondFacets = Array<string> // TODO support Object for facet : {contract} // could be deploymentNames too ? or {abi,address}

export interface CallOptions {
  from?: string
  gasLimit?: string | number | BigNumber
  gasPrice?: string | BigNumber
  value?: string | BigNumber
  nonce?: string | number | BigNumber
  to?: string // TODO make to and data part of a `SimpleCallOptions` interface
  data?: string
}

export type Libraries = { [libraryName: string]: Address }

export interface FacetCut {
  facetAddress: string
  functionSelectors: string[]
}

// export type LibraryReferences = {
//   [filepath: string]: { [name: string]: { length: number; start: number }[] };
// };

export interface Deployment {
  abi: ABI
  address: Address
  receipt?: Receipt
  transactionHash?: string
  history?: Deployment[]
  implementation?: string
  args?: any[]
  linkedData?: any
  solcInputHash?: string
  metadata?: string
  bytecode?: string
  deployedBytecode?: string
  libraries?: Libraries
}
