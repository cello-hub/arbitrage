import { createLogger, format, transports } from 'winston'
import config from './config'

const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf((info) => {
      return `${String(info.timestamp)} ${info.level}: ${String(info.message)}`
    })
  ),
  transports: [new transports.Console({ level: config.logLevel })]
})

export default logger
