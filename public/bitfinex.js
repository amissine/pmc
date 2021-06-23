//
// https://docs.bitfinex.com/docs/rest-public
//
(function () {

  const config = {
    url: 'http://localhost:5000/bitfinex',
    urlBook: (u, p) => `${u}?pair=${p}`,
    rateLimitMs: 2500,
    count: 999,
    map: pair => {
      let dash = pair.indexOf('-')
      let base = pair.slice(0, dash), quote = pair.slice(dash + 1)
      switch (quote) {
        case 'USD':
          return `${base}-USDC`;
      }
      return pair;
    },
  }

  doGet(config.url, data => postMessage(pairs(data)))

  onmessage = e => {
    let symbol = pair(e.data[0], e.data[1]), index = e.data[2],
      count = 0, requestInProgress = false, 
      feed = setInterval(() => {
        if (requestInProgress) {
          console.log('- REQUEST IN PROGRESS')
        } else {
          //console.time(product)
          doGet(config.urlBook(config.url, symbol), orderBook)
          if (++count > config.count) {
            clearInterval(feed); postMessage(null)
          }
          requestInProgress = true
        }
      }, config.rateLimitMs)

    function orderBook (data) {
      //console.timeEnd(product)
      requestInProgress = false
      postMessage([index, bids(data), asks(data), Date.now()])
    }
  }

  function doGet (url, cb) {
    fetch(url).
      then(response => response.json()).
      then(cb)
  }

  function pair (base, quote) { // TODO complete
    return base;
  }

  function bids (data) { // TODO complete
    return data;
  }

  function asks (data) { // TODO complete
    return data;
  }

  function pairs (data) {
    let result = []
    for (const item of data) {
      let pair = item[0]
      if (!pair.startsWith('t')) {
        continue
      }
      pair = pair.slice(1)
      if (pair.indexOf(':') > 0) {
        pair = pair.replace(':', '-')
      } else {
        let base = pair.slice(0, 3), quote = pair.slice(3)
        pair = base + '-' + quote
      }
      result.push({ pair: config.map(pair) })
    }
    return result;
  }

})()
