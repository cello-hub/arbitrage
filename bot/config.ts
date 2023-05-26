import { utils, type BigNumber, type BigNumberish } from 'ethers'

interface Config {
  contractAddr: string
  logLevel: string
  minimumProfit: number
  gasPrice: BigNumber
  gasLimit: BigNumberish
  bscScanUrl: string
  concurrency: number
}

const contractAddr = '0xXXXXXXXXXXXXXXXXXXXXXX' // flash bot contract address
const gasPrice = utils.parseUnits('10', 'gwei')
const gasLimit = 300000

const bscScanApiKey = 'XXXXXXXXXXXXXXXX' // bscscan API key
const bscScanUrl = `https://api.bscscan.com/api?module=stats&action=bnbprice&apikey=${bscScanApiKey}`

const config: Config = {
  contractAddr,
  logLevel: 'info',
  concurrency: 50,
  minimumProfit: 50, // in USD
  gasPrice,
  gasLimit,
  bscScanUrl
}

export default config
