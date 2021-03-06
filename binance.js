//
// https://github.com/binance/binance-spot-api-docs/blob/master/rest-api.md
//
(function () {

  const config = {
    url: 'https://api.binance.com/api/v3',
    urlPairs: u => `${u}/exchangeInfo`,
    urlBook: (u, s) => `${u}/depth?symbol=${s}&limit=5`,
    rateLimitMs: 2500,
    count: 999,
  }

  doGet(config.urlPairs(config.url), data => postMessage(pairs(data)))

  onmessage = e => {
    let symbol = `${e.data[0]}${e.data[1]}`, index = e.data[2],
      count = 0, requestInProgress = false, //lastUpdateIdP = -1,
      feed = setInterval(() => {
        if (requestInProgress) {
          console.log('- REQUEST IN PROGRESS')
        } else {
          //console.time(symbol)
          doGet(config.urlBook(config.url, symbol), orderBook)
          if (++count > config.count) {
            clearInterval(feed); postMessage(null)
          }
          requestInProgress = true
        }
      }, config.rateLimitMs)

    function orderBook (data) {
      //console.timeEnd(symbol)
      requestInProgress = false
      /*
      if (data.lastUpdateId == lastUpdateIdP) {
        return;
      }
      lastUpdateIdP = data.lastUpdateId
      */
      postMessage([index, data.bids, data.asks, Date.now()])
    }
  }

  function doGet (url, cb) {
    fetch(url).then(response => response.json()).then(cb)
  }

  function pairs (data) {
    let result = []
    for (const item of data.symbols) {
      result.push({ pair: item.baseAsset + '-' + item.quoteAsset })
    }
    return result;
  }

})()
