(function (config) {
  if (!window.Worker) {
    console.log('This browser doesn\'t support web workers.')
    return;
  }

  let freeze = false

  let count = 0 // TODO Developer Tools -> Network: Disable Cache
  let intersection = null
  for (let exchange of config.exchanges) {
    exchange.worker = new Worker(exchange.name + '.js')
    exchange.worker.onmessage = e => {
      updateIntersection(e.data)
      if (++count == config.exchanges.length) {
        intersection.sort((a, b) => a.pair > b.pair)
        console.log(intersection)
        freeze = true
      }
    }
  }

  function updateIntersection (pairs) {
    if (intersection == null) {
      intersection = pairs
      return;
    }
    intersection = intersection.filter(p => pairs.find(q => p.pair == q.pair))
  }
  
  function update()
  {
    if (!freeze) {
      requestAnimationFrame(update)
    } else {
      console.log('😅')
    }
  }

  update()

})(config)
