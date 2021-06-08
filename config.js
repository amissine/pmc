class TimeSeries // {{{1
{
  constructor (xCount, obDepth) // {{{2
  {
    this.xCount  = xCount
    this.obDepth = obDepth
    this.xIndex = []
    for (let i = 0; i < xCount; i++) {
      this.xIndex.push(1 + i * 4 * obDepth) // asks and bids, price/amount
    }
  }
  _ts (count) // {{{2
  {
    let a = [ [] ]
    for (let i = 0; i < count; i++) {
      a.push([])
    }
    return a;
  }
  get ob() // {{{2
  {
    return this._ts(this.xCount * 4 * this.obDepth); // asks and bids, price/amount
  }
  obAdd(a, item) // {{{2
  {
    let xIndex = item[0], bids = item[1], asks = item[2]
    console.assert(bids.length == 5 && asks.length == 5, item)

    // Order Book arrival time
    let size = a[0].push(Date.now())

    // Add item data
  
    // Add nulls
  
    // Shift out old data
  }
}

// This configuration, combined with config values in binance.js and {{{1
// coinbase.js,  feeds and plots order books of depth 5 each 2500 ms. The data 
// visibility duration (the time frame) is 120000 ms.
const config = // {{{1
{
  timeFrameMs: 120000,
  exchanges: [
    { name: 'binance', // {{{2
    },
    /* CORS { name: 'bitfinex', // {{{2
    },*/
    { name: 'coinbase', // {{{2
    } // }}}2
  ],
  orderBookDepth: 5,
}

let ts2plot = new TimeSeries(config.exchanges.length, config.orderBookDepth),
  data2plot = ts2plot.ob
