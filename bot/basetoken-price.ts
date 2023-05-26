import axios from 'axios'
import AsyncLock from 'async-lock'

import config from './config'
import logger from './logger'

const lock = new AsyncLock()

const lockName = 'bnb-price'
let bnbPrice = 0

setInterval(() => {
  lock
    .acquire(lockName, () => {
      bnbPrice = 0
    })
    .catch(() => {})
}, 3600000)

export const getBnbPrice = async (): Promise<number> => {
  const price = await lock.acquire(lockName, async () => {
    if (bnbPrice !== 0) {
      return bnbPrice
    }
    const res = await axios.get(config.bscScanUrl)
    bnbPrice = parseFloat(res.data.result.ethusd)
    logger.info(`BNB price: $${bnbPrice}`)
    return bnbPrice
  })
  return price
}
