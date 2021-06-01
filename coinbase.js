fetch('https://api.pro.coinbase.com/products')
  .then(response => response.json())
  .then(data => postMessage(pairs(data)))

onmessage = e => {
  console.log(e.data)
}

function pairs (data) {
  let result = []
  for (const item of data) {
    result.push({ pair: item.id })
  }
  return result;
}
