//
// https://docs.bitfinex.com/docs/rest-public
//
(function () {

  const config = {
    url: 'http://localhost:5000/bitfinex',
    urlBook: (u, p) => `${u}?pair=${p}`,
    rateLimitMs: 2500,
    count: 999,
  }

  doGet(config.url, data => postMessage(pairs(data)))

  onmessage = e => {
    let symbol = pair(e.data[0], e.data[1], index = e.data[2],
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
/*
fetch('https://api-pub.bitfinex.com/v2/tickers?symbols=ALL')
  .then(response => response.json())
  .then(data => postMessage(pairs(data)))
  .catch(e => console.log(e))
*/

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
        let base = pair(0, 3), quote = pair(3)
        pair = base + '-' + quote
      }
      result.push({ pair: pair })
    }
    return result;
  }

})()
