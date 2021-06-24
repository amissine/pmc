//
// https://docs.bitfinex.com/docs/rest-public
//
(function () {

  const config = {
    url: 'http://localhost:5000/bitfinex',
    urlBook: (u, p) => `${u}?pair=${p}`,
    rateLimitMs: 2500,
    count: 999,
    pair: p => {
      let dash = p.indexOf('-')
      let base = p.slice(0, dash), quote = p.slice(dash + 1)
      switch (quote) {
        case 'USD':
          return `${base}-USDC`;
      }
      return p;
    },
    quote: q => {
      switch (q) {
        case 'USDC':
          return 'USD';
      }
      return q;
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

  function pair (base, quote) {
    if (base.length > 3) {
      base += ':'
    }
    return `t${base}${config.quote(quote)}`;
  }

  function bids (data) {
    return first5(data.slice(0, data.length / 2));
  }

  function asks (data) {
    let f5 = first5(data.slice(data.length / 2))
    for (let pa of f5) {
      pa[1] = -pa[1]
    }
    return f5;
  }

  function first5 (a3) {
    let f5 = a3.slice(0, 5)
    for (let pqa of f5) {
      pqa.splice(1, 1) // => pa: price, amount
    }
    return f5;
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
      result.push({ pair: config.pair(pair) })
    }
    return result;
  }

})()
