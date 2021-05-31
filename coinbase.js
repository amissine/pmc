fetch('https://api.pro.coinbase.com/products')
  .then(response => response.json())
  .then(data => postMessage(assets2trade(data)))

onmessage = e => {
  console.log(e.data)
}

function assets2trade (data) {
  return data;
}
