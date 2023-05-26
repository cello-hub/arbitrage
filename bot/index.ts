import { ethers } from 'hardhat'
import { BigNumber } from 'ethers'
import pool from '@ricokahler/pool'
import AsyncLock from 'async-lock'

import type { FlashBot } from '../typechain-types/contracts/flashbot/FlashBot'
import { Network, tryLoadPairs, getTokens } from './tokens'
import { getBnbPrice } from './basetoken-price'
import log from './logger'
import config from './config'

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function calcNetProfit(
  profitWei: BigNumber,
  address: string,
  baseTokens: Tokens
): Promise<number> {
  let price = 1
  if (baseTokens.wbnb.address === address) {
    price = await getBnbPrice()
  }
  let profit = parseFloat(ethers.utils.formatEther(profitWei))
  profit = profit * price

  const gasCost =
    price *
    parseFloat(ethers.utils.formatEther(config.gasPrice)) *
    (config.gasLimit as number)
  return profit - gasCost
}

const arbitrageFunc = (
  flashBot: FlashBot,
  baseTokens: Tokens
): ((pair: ArbitragePair) => Promise<void>) => {
  const lock = new AsyncLock({ timeout: 2000, maxPending: 20 })
  return async (pair: ArbitragePair): Promise<void> => {
    const [pair0, pair1] = pair.pairs
    let res: [BigNumber, string] & {
      profit: BigNumber
      baseToken: string
    }
    try {
      res = await flashBot.getProfit(pair0, pair1)
      log.debug(
        `Profit on ${pair.symbols}: ${ethers.utils.formatEther(res.profit)}`
      )
    } catch (err) {
      log.debug(err)
      return
    }

    if (res.profit.gt(BigNumber.from('0'))) {
      const netProfit = await calcNetProfit(
        res.profit,
        res.baseToken,
        baseTokens
      )
      if (netProfit < config.minimumProfit) {
        return
      }

      log.info(`Calling flash arbitrage, net profit: ${netProfit}`)
      try {
        // lock to prevent tx nonce overlap
        await lock.acquire('flash-bot', async () => {
          const response = await flashBot.flashArbitrage(pair0, pair1, {
            gasPrice: config.gasPrice,
            gasLimit: config.gasLimit
          })
          const receipt = await response.wait(1)
          log.info(`Tx: ${receipt.transactionHash}`)
        })
      } catch (e: any) {
        if (
          e.message === 'Too much pending tasks' ||
          e.message === 'async-lock timed out'
        ) {
          return
        }
        log.error(e)
      }
    }
  }
}

const main = async (): Promise<void> => {
  const pairs = await tryLoadPairs(Network.BSC)
  const flashBot = (await ethers.getContractAt(
    'FlashBot',
    config.contractAddr
  )) as FlashBot
  const [baseTokens] = getTokens(Network.BSC)

  log.info('Start arbitraging')
  while (true) {
    await pool({
      collection: pairs,
      task: arbitrageFunc(flashBot, baseTokens)
      // maxConcurrency: config.concurrency,
    })
    await sleep(1000)
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    log.error(err)
    process.exit(1)
  })
