function getSize() { // {{{1
  return {
    width: window.innerWidth - 20,
    height: window.innerHeight  / 4,
  }
}

const opts3 = { // {{{1
  title: "Aggregated history, 10s prices and 30s amounts",
  ...getSize(),
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
  series: [ // {{{2
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
  ], // }}}2
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
    if (u.data[0].length == 0) {
      return;
    }
    u.ctx.save()
    let [iMin, iMax] = u.series[0].idxs
    for (let i = iMin; i < iMax; i++) {
      let timeAsX  = u.valToPos(u.data[0][i], 'x', true)
      let openAsY  = u.valToPos(u.data[15][i], 'y', true) // FIXME
      let highAsY  = u.valToPos(u.data[16][i], 'y', true)
      let lowAsY   = u.valToPos(u.data[17][i], 'y', true)
      let closeAsY = u.valToPos(u.data[18][i], 'y', true)

      u.ctx.strokeStyle = 'purple'

      // horizontal open line
      u.ctx.beginPath()
      u.ctx.moveTo(timeAsX, openAsY)
      u.ctx.lineTo(timeAsX+6, openAsY)
      u.ctx.stroke()

      // vertical high-low line
      u.ctx.beginPath()
      u.ctx.moveTo(timeAsX+6, highAsY)
      u.ctx.lineTo(timeAsX+6, lowAsY)
      u.ctx.stroke()

      // horizontal close line
      u.ctx.beginPath()
      u.ctx.moveTo(timeAsX+6, closeAsY)
      u.ctx.lineTo(timeAsX+12, closeAsY)
      u.ctx.stroke()
    }
    u.ctx.restore()
  }

  return {
    hooks: { draw: ohlcDraw }
  };
}

