(function (config) {
  if (!window.Worker) {
    console.log('This browser doesn\'t support web workers.')
    return;
  }

  let freeze = false

  let count = 0 // TODO Developer Tools -> Network: Disable Cache
  for (let exchange of config.exchanges) {
    exchange.worker = new Worker(exchange.name + '.js')
    exchange.worker.onmessage = e => {
      console.log(e.data)
      if (++count == config.exchanges.length) {
        freeze = true
      }
    }
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
