//const log = console.log

let cb

export default function (item, callback) {
  const id = item[0], qt = item[item.length - 2], pt = item[item.length - 1]
  if (pt == 0) {
    //log(`${id}: ${qt}`)
    cb = callback
    spreadsAdd(item)
    return;
  }
  let delta = qt - pt
  if (delta > 1500) {
    //log('')
    spreadsNew()
  }
  //log(`${id}: ${qt} >>>  ∆ ${delta}`)
  spreadsAdd(item)
}

let spreads = [], spreadsMaxLength = 0

function spreadsNew () {
  if (spreads.length > 0) {
    if (spreadsMaxLength == 0) {        // assuming 1st pack of spreads
      spreadsMaxLength = spreads.length // comes in full
    }
    arbitrage() // also runs on incomplete packs of spreads
  }
}

function spreadsAdd (item) {
  spreads.push([item[0], item[1][0], item[2][0]]) // xid, maxbid, minask
  if (spreads.length == spreadsMaxLength) {
    arbitrage()
  }
}

function arbitrage () {
  if (spreads.length < 2) {
    log('=== NOTHING TO ARBITRAGE ===')
    spreads = []
    return;
  }
  const arbitrageOpportunity = ao()
  cb(arbitrageOpportunity)
  //log(`ao: ${arbitrageOpportunity}\n`)
  spreads = []
}

const min = Math.min, max = Math.max, from = Array.from
const pairs = (x, i) => from(
  from(spreads, (x2p, j) => j > i ? x2p : undefined),
  x2p => x2p ? [x, x2p] : undefined)
const maxpairs = p => {
  while (p.length > 0 && p[0] === undefined) {
    p.shift()
  }
  return p.length == 0 ? 0 : max(...from(p, c => ao(c[0], c[1]) ?? 0));
}

function ao (...args) {
  if (args.length == 0) {
    return max(...from(
      from(spreads, pairs),
      p => maxpairs(p)));
  } else {
    const sTopBid = args[0][1][0] > args[1][1][0] ? args[0] : args[1]
    const sBtmAsk = args[0][2][0] < args[1][2][0] ? args[0] : args[1]

    if (+sTopBid[1][0] > +sBtmAsk[2][0]) {
      return (sTopBid[1][0] - sBtmAsk[2][0])
             * min(+sTopBid[1][1], +sBtmAsk[2][1]);
    }
    return undefined;
  }
}
