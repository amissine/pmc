const opts3 = {
  title: "Aggregated history, 10s prices and 30s amounts",
  width: 600,
  height: window.innerHeight  / 4,
  pxAlign: 0,
  ms: 1,
  cursor: { drag: { x: true, y: true } },
  pxSnap: false,
  plugins: [
    bsPlugin(),
    labelPlugin(),
    ohlcPlugin()
  ],
  scales: {
    x: {},
    vol: {},
  },
  axes: [
    {}, // time
    {}, // price
    {  // amount
      side: 1, scale: 'vol', grid: {show: false}
    }
  ],
  series: [ // {{{1
    { label: 'time', value: (u, v) => v },
    { label: 'kraken buy', scale: 'vol' },
    { label: 'kraken sell', scale: 'vol' },
    { label: 'bitfinex buy', scale: 'vol' },
    { label: 'bitfinex sell', scale: 'vol' },
    { label: 'coinbase buy', scale: 'vol' },
    { label: 'coinbase sell', scale: 'vol' },
    { label: 'kraken o', value: (u, v) => v },
    { label: 'kraken h', value: (u, v) => v },
    { label: 'kraken l', value: (u, v) => v },
    { label: 'kraken c', value: (u, v) => v },
    { label: 'bitfinex o', value: (u, v) => v },
    { label: 'bitfinex h', value: (u, v) => v },
    { label: 'bitfinex l', value: (u, v) => v },
    { label: 'bitfinex c', value: (u, v) => v },
    { label: 'coinbase o', value: (u, v) => v },
    { label: 'coinbase h', value: (u, v) => v },
    { label: 'coinbase l', value: (u, v) => v },
    { label: 'coinbase c', value: (u, v) => v },
  ], // }}}1
};

function bsPlugin () { // {{{1

  function bsDraw (u) {
    if (u.data[0].length > 0) {
      return;
    }
  }

  return {
    opts: (u, opts) => {
      uPlot.assign(opts, { cursor: { points: { show: false } } })
      opts.series.forEach(series => {
        series.paths = () => null;
        series.points = { show: false };
      })
    },
    hooks: { draw: bsDraw }
  };
}

function labelPlugin () { // {{{1
  let legendEl

  function init (u, opts) {
    legendEl = u.root.querySelector('.u-legend')
    legendEl.classList.remove('u-inline')
    uPlot.assign(legendEl.style, { display: 'none' })
  }

  function update (u) {
  }

  return {
    hooks: {
      init: init,
      setCursor: update
    }
  };
}

function ohlcPlugin () { // {{{1

  function ohlcDraw (u) {
    if (u.data[0].length > 0) {
      return;
    }
  }

  return {
    hooks: { draw: ohlcDraw }
  };
}

