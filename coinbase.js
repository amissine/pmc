//
// https://docs.pro.coinbase.com/#products
//
(function () {

  const config = {
    url: 'https://api.pro.coinbase.com/products',
    urlBook: (u, p) => `${u}/${p}/book?level=2`,
    rateLimitMs: 2500,
  }

  doGet(config.url, data => postMessage(pairs(data)))

  onmessage = e => {
    let product = `${e.data[0]}-${e.data[1]}`, index = e.data[2],
      count = 0, requestInProgress = false, sequenceP = -1,
      feed = setInterval(() => {
        if (requestInProgress) {
          console.log('- REQUEST IN PROGRESS')
        } else {
          //console.time(product)
          doGet(config.urlBook(config.url, product), orderBook)
          if (++count > 9) {
            clearInterval(feed); postMessage(null)
          }
          requestInProgress = true
        }
      }, config.rateLimitMs)

    function orderBook (data) {
      //console.timeEnd(product)
      requestInProgress = false
      if (data.sequence == sequenceP) {
        return;
      }
      sequenceP = data.sequence
      postMessage([index, data.bids.slice(0, 5), data.asks.slice(0, 5)])
    }
  }

  function doGet (url, cb) {
    fetch(url).
      then(response => response.json()).
      then(cb)
  }

  function pairs (data) {
    let result = []
    for (const item of data) {
      result.push({ pair: item.id })
    }
    return result;
  }

})()
