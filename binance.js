fetch('https://api.binance.com/api/v3/exchangeInfo')
  .then(response => response.json())
  .then(data => postMessage(pairs(data)))

onmessage = e => {
  console.log(e.data)
}

function pairs (data) {
  let result = []
  for (const item of data.symbols) {
    result.push({ pair: item.baseAsset + '-' + item.quoteAsset })
  }
  return result;
}
