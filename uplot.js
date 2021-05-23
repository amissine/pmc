const windowSize = 120000; // {{{1
const datasize = 2000;
const data = [ [], [], [], [] ] // trades
const d = [ [], [], [], [], [], [], [] ]// aggregated buy and sell amounts
let plot2min = +0, plot3min = +0

const scales = { // {{{1
  x: {},
  y: {
    auto: false,
    range: [-1000, +1000]
  }
}

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

let agg5  = [ new Agg(5),  new Agg(5),  new Agg(5), ] // {{{1
let agg10 = [ new Agg(10), new Agg(10), new Agg(10), ]
let agg30 = [ new Agg(30), new Agg(30), new Agg(30), ]

function recvTradesXLM (exchangeIdx, umf) { // TODO splice umf into chart data {{{1
  let anIdx = (exchangeIdx + 1) * 2, apIdx = anIdx - 1
  for (let i = 0; i < umf.length; i++) {
    data[0]              .push(umf[i].time)    
    data[1 + exchangeIdx].push(umf[i].price)
    while (plot3min > data[0][0]) {
      data[0].shift()
      data[1 + exchangeIdx].shift()
    }

    agg5[exchangeIdx].bs(umf[i].time, umf[i].amount, (t, ap, an) => {
      d[0].push(t); d[apIdx].push(ap); d[anIdx].push(an)
      while (plot2min > d[0][0]) {
        d[0].shift(); d[apIdx].shift(); d[anIdx].shift()
      }
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
  //scales,
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
