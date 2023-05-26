import { type HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import 'dotenv/config'

const bscRpc = 'https://bsc-dataseed1.defibit.io/'
const bscTestnetRpc = 'https://data-seed-prebsc-1-s1.binance.org:8545/'

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  networks: {
    hardhat: {
      forking: {
        url: bscRpc,
        enabled: true
      },
      accounts: {
        accountsBalance: '1000000000000000000000000'
      }
    },
    bscTestnet: {
      url: bscTestnetRpc,
      chainId: 0x61,
      accounts: [process.env.private]
    },
    bsc: {
      url: bscRpc,
      chainId: 0x38,
      accounts: [process.env.private]
    }
  }
}

export default config
