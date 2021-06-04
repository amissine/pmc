// TODO use via our server
(function () {

fetch('https://api-pub.bitfinex.com/v2/tickers?symbols=ALL')
  .then(response => response.json())
  .then(data => postMessage(pairs(data)))
  .catch(e => console.log(e))


onmessage = e => {
  console.log(e.data)
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
