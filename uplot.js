const windowSize = 120000; // {{{1
const exchangePoolsize = 3
const bsSize = exchangePoolsize * 2
const ohlcSize = exchangePoolsize * 4
const data = [ [] ] // raw trades, no aggreration
for (let i = 0; i < exchangePoolsize; i++) {
  data.push([])
}
const d = [ [] ] // 5s-aggregated buy and sell amounts
for (let i = 0; i < bsSize; i++) {
  d.push([])
}
const dagg1030 = [ [] ] // 30s buy/sell, 10s OHLC 
for (let i = 0; i < bsSize + ohlcSize; i++) {
  dagg1030.push([])
}
let plot2min = +0, plot3min = +0 // float with time

/*const scales = { // {{{1
  x: {},
  y: {
    auto: false,
    range: [-1000, +1000]
  }
}*/

class Agg { // {{{1
  constructor(paneInSeconds) {
    this.paneMs = paneInSeconds * 1000
    this.pt = this.ab = this.as = +0
    this.o = this.h = this.l = this.c = +0
  }
  _agg (qt, cb, aggregate) {
    if (this.pt > 0) {
      if (qt > this.pt) {
        this.pt = qt; cb(qt)
      }
    } else { // start aggregation
      this.pt = qt
    }
    aggregate()
  }
  bs (t, a, cb) {
    this._agg(t - t % this.paneMs, 
      qt => { cb(qt, this.ab, this.as); this.ab = this.as = +0 },
      () => { if (a > 0) this.ab += a; else this.as += a })
  }
  ohlc (t, p, cb) {
    this._agg(t - t % this.paneMs,
      qt => { cb(qt, this.o, this.h, this.l, this.c); this.o = +0 },
      () => {
        if (this.o == 0) {
          this.o = this.h = this.l = this.c = p; return;
        }
        if (this.h < p) this.h = p
        else if (this.l > p) this.l = p
        this.c = p
      })
  }
}

const agg5 = [], agg10 = [], agg30 = [] // {{{1
for (let i = 0; i < exchangePoolsize; i++) {
  agg5.push(new Agg(5)); agg10.push(new Agg(10)); agg30.push(new Agg(30))
}

function recvTradesXLM (exchangeIdx, umf) { // TODO splice umf into chart data {{{1
  let dataIdx = exchangeIdx + 1, 
    dsIdx = dataIdx * 2, dbIdx = dsIdx - 1,     // 2: b, s
    dagg1030sIdx = dsIdx, dagg1030bIdx = dbIdx, //
    o2 = bsSize + exchangeIdx * 4 + 1           // 4: o, h, l, c
    dagg1030oIdx = o2, dagg1030hIdx = o2 + 1, dagg1030lIdx = o2 + 2, dagg1030cIdx = o2 + 3

  for (let i = 0; i < umf.length; i++) {
    data[0]      .push(umf[i].time) // {{{2
    data[dataIdx].push(umf[i].price)
    while (plot2min > data[0][0]) {
      data[0].shift()
      data[1 + exchangeIdx].shift()
    }

    agg5[exchangeIdx].bs(umf[i].time, umf[i].amount, (t, b, s) => { // {{{2
      d[0].push(t); d[dbIdx].push(b); d[dsIdx].push(s)
      while (plot2min > d[0][0]) {
        d[0].shift(); d[dbIdx].shift(); d[dsIdx].shift()
      }
    })
    agg10[exchangeIdx].ohlc(umf[i].time, umf[i].price, (t, o, h, l, c) => { // {{{2
      dagg1030[0]           .push(t)
      dagg1030[dagg1030oIdx].push(o)
      dagg1030[dagg1030hIdx].push(h)
      dagg1030[dagg1030lIdx].push(l)
      dagg1030[dagg1030cIdx].push(c)
      dagg1030[dagg1030bIdx].push(null); dagg1030[dagg1030sIdx].push(null)
      while (dagg1030[0].length > 1 && plot3min > dagg1030[0][0]) {
        dagg1030[0].shift()
        dagg1030[dagg1030oIdx].shift()
        dagg1030[dagg1030hIdx].shift()
        dagg1030[dagg1030lIdx].shift()
        dagg1030[dagg1030cIdx].shift()
        dagg1030[dagg1030bIdx].shift(); dagg1030[dagg1030sIdx].shift()
      }
    })
    agg30[exchangeIdx].bs(umf[i].time, umf[i].amount, (t, b, s) => { // {{{2
      let db = dagg1030[dagg1030bIdx], ds = dagg1030[dagg1030sIdx],
        last = dagg1030[0].length - 1, tLast = dagg1030[0][last]
      db[last] = b; ds[last] = s
    })
  }
}

function getSize() { // {{{1
  return {
    width: window.innerWidth - 20,
    height: window.innerHeight  / 4,
  }
}

const opts1 = { // {{{1
  title: "Latest XLM prices",
  ...getSize(),
  ms: 1,
  series: // {{{2
  [ 
    {},
    {
      stroke: "red",
      label: 'kraken',
      paths: uPlot.paths.linear(),
      //spanGaps: true,
      points: { show: true }
    },
    {
      stroke: "blue",
      label: 'bitfinex',
      paths: uPlot.paths.spline(),
      //spanGaps: true,
      points: { show: true }
    },
    {
      stroke: "purple",
      label: 'coinbase',
      paths: uPlot.paths.stepped({align: 1}),
      //spanGaps: true,
      points: { show: true }
    },
  ], // }}}2
};

const opts2 = { // {{{1
  title: "Latest XLM amounts, 5s-aggregated",
  ...getSize(),
  pxAlign: 0,
  ms: 1,
  cursor: { drag: { x: true, y: true } },
  pxSnap: false,
  series: // {{{2
  [
    {},
    { // {{{3
      label: 'kraken buy',
      stroke: "red",
      fill: "red",
      lineInterpolation: null,
      width: 1 / devicePixelRatio,
      paths: uPlot.paths.bars({ size: [1], align: -1 }),
      pxAlign: 0,
      points: { show: true }
    },
    { // {{{3
      label: 'kraken sell',
      stroke: "red",
      fill: "red",
      lineInterpolation: null,
      width: 1 / devicePixelRatio,
      paths: uPlot.paths.bars({ size: [1], align: -1 }),
      pxAlign: 0,
      points: { show: true }
    },
    { // {{{3
      label: 'bitfinex buy',
      stroke: "blue",
      fill: "blue",
      lineInterpolation: null,
      width: 1 / devicePixelRatio,
      paths: uPlot.paths.bars({ size: [1], align: -1 }),
      pxAlign: 0,
      points: { show: true }
    },
    { // {{{3
      label: 'bitfinex sell',
      stroke: "blue",
      fill: "blue",
      lineInterpolation: null,
      width: 1 / devicePixelRatio,
      paths: uPlot.paths.bars({ size: [1], align: -1 }),
      pxAlign: 0,
      points: { show: true }
    },
    { // {{{3
      label: 'coinbase buy',
      stroke: "purple",
      fill: "purple",
      lineInterpolation: null,
      width: 1 / devicePixelRatio,
      paths: uPlot.paths.bars({ size: [1], align: -1 }),
      pxAlign: 0,
      points: { show: true }
    },
    { // {{{3
      stroke: "purple",
      fill: "purple",
      lineInterpolation: null,
      width: 1 / devicePixelRatio,
      label: 'coinbase sell',
      paths: uPlot.paths.bars({ size: [1], align: -1 }),
      pxAlign: 0,
      points: { show: true }
    }, // }}}3
  ], // }}}2
};

const opts3 = { // {{{1
  title: "Aggregated history, 10s prices and 30s amounts",
  width: 600,
  height: window.innerHeight  / 4,
  pxAlign: 0,
  ms: 1,
  cursor: { drag: { x: true, y: true } },
  pxSnap: false,
  series: // {{{2
  [
    {},
    {
      stroke: "red",
      label: 'kraken',
      paths: uPlot.paths.linear(),
      pxAlign: 0,
      points: { show: true }
    },
    {
      stroke: "blue",
      label: 'bitfinex',
      paths: uPlot.paths.spline(),
      pxAlign: 0,
      points: { show: true }
    },
    {
      stroke: "purple",
      label: 'coinbase',
      paths: uPlot.paths.bars({ align: 1 }),
      pxAlign: 0,
      points: { show: true }
    },
  ], // }}}2
};

let u3 = new uPlot(opts3, data, document.getElementById('charts')); // {{{1

let u1 = new uPlot(opts1, data, document.getElementById('charts')); // {{{1

let u2 = new uPlot(opts2, data, document.getElementById('charts')); // {{{1

let freeze = false // {{{1
function update()
{
  const now 	= Date.now();
  const scale = {min: now - windowSize, max: now};    plot2min = scale.min
  const scale3 = {min: now - windowSize*2, max: now}; plot3min = scale3.min

  u1.setData(data);
  u2.setData(d);
  u3.setData(data);
  u1.setScale('x', scale);
  u2.setScale('x', scale);
  u3.setScale('x', scale3);
  if (!freeze) {
    requestAnimationFrame(update)
  }
}

update()
