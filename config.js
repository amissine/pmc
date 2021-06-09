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
    this.total = xCount * 4 * obDepth + 1
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
  obAdd(a, item, he) // {{{2
  {
    let xIndex = item[0], bids = item[1], asks = item[2]
    console.assert(bids.length == this.obDepth && asks.length == this.obDepth, item)

    // Order Book Item arrival time
    let size = a[0].push(Date.now())

    // Add item data
    let xo = this.xIndex[xIndex]
    for (let i = 0; i < asks.length; i++) {
      a[xo++].push( asks[asks.length - 1 - i][0]) // price
      a[xo++].push(-asks[asks.length - 1 - i][1]) // amount < 0
    }
    for (let i = 0; i < bids.length; i++) {
      a[xo++].push(bids[i][0]) // price
      a[xo++].push(bids[i][1]) // amount > 0
    }
  
    // Add nulls
    for (let i = 1; i < this.total; i++) {
      if (a[i].length < size) {
        a[i].push(null)
      }
    }
  
    // Shift out the old data beyond history edge
    while (a[0].length > 1 && he > a[0][0]) {
      for (let i = 0; i < this.total; i++) {
        a[i].shift()
      }
    }
  } // }}}2
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
  rateLimitMs: 2500, // TODO correlate with exchanges
}

let ts2plot = new TimeSeries(config.exchanges.length, config.orderBookDepth),
  data2plot = ts2plot.ob

const opts = // {{{1
{
} // TODO complete
