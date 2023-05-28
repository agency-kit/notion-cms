/* eslint-disable no-console */
import type { Stats } from './types'

const START = 'request start'
const SUCCESS = 'request success'
const FAILURE = 'request fail'

type ExtraInfo = Record<string, unknown>

export default class NotionLogger {
  debug: boolean
  stats: Pick<Stats,
    'totalAPICalls' |
    'failedCalls' |
    'succeededCalls'>

  constructor({ debug = false }: { debug: boolean }) {
    this.debug = debug
    this.stats = {
      totalAPICalls: 0,
      succeededCalls: 0,
      failedCalls: 0,
    }
  }

  log(logLevel: string, message: string, extraInfo: ExtraInfo): void {
    if (this.debug) {
      console.log('logLevel:', logLevel)
      console.log('message:', message)
      console.log('extraInfo:', extraInfo)
    }
    this.handleMessage(message)
  }

  handleMessage(message: string): void {
    switch (message) {
      case START:
        this.stats.totalAPICalls++
        break
      case SUCCESS:
        this.stats.succeededCalls++
        break
      case FAILURE:
        this.stats.failedCalls++
        break
    }
  }

  handleLogLevel(logLevel: string): void {}

  handleExtraInfo(extraInfo: ExtraInfo): void {}

  resetStats(): void {
    this.stats = {
      totalAPICalls: 0,
      failedCalls: 0,
      succeededCalls: 0,
    }
  }
}
