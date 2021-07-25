import { config } from './config.js'
import feed from './feed.js'

let header = document.getElementById('header')
header.textContent = 'Arbitrage opportunities since ' + new Date()
config('arbitrage')(feed)
