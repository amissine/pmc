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

class Agg5 { // {{{1
  constructor() {
    this.pt = this.ap = this.an  = +0
  }
  add (t, a, cb) {
    let qt = t - t % 5000
    if (this.pt > 0) {
      if (qt > this.pt) { // push and cleanup
        cb(qt, a > 0 ? this.ap : this.an); this.pt = qt
        if (a > 0) this.ap = +0; else this.an = +0
      }
    } else { // start aggregation
      this.pt = qt
    }
    if (a > 0) this.ap += a; else this.an += a
  }
}

let agg5 = [ new Agg5(), new Agg5(), new Agg5(), ]

function recvTradesXLM (exchangeIdx, umf) { // TODO splice umf into chart data {{{1
  let aIdx = (exchangeIdx + 1) * 2
  for (let i = 0; i < umf.length; i++) {
    data[0].push(umf[i].time)    
    data[1 + exchangeIdx].push(umf[i].price)
    while (plot3min > data[0][0]) {
      data[0].shift()
      data[1 + exchangeIdx].shift()
    }

    agg5[exchangeIdx].add(umf[i].time, umf[i].amount, (t, a) => {
      let idx = a > 0 ? aIdx - 1 : aIdx
      d[0].push(t)
      d[idx].push(a)
      while (plot2min > d[0][0]) {
        d[0].shift()
        d[idx].shift()
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
  title: "Aggregated history",
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
