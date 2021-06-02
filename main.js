(function (config) {
  if (!window.Worker) {
    console.log('This browser doesn\'t support web workers.')
    return;
  }

  let freeze = false

  let pairs = document.getElementById('pairs')
  let count = 0 // TODO Developer Tools -> Network: Disable Cache
  let intersection = null
  for (let exchange of config.exchanges) {
    exchange.worker = new Worker(exchange.name + '.js')
    exchange.worker.onmessage = e => {
      pairs.firstChild.data = intersection == null ? exchange.name :
        pairs.firstChild.data + ' ∩ ' + exchange.name
      updateIntersection(e.data)
      if (++count == config.exchanges.length) {
        intersection.sort((a, b) => a.pair > b.pair)
        showPairSelectionUI()
        freeze = true
      }
    }
  }

  function showPairSelectionUI () {
    pairs.firstElementChild.hidden = true
    pairs.firstChild.data += ' base-quote asset pairs:'
    let pair  = document.getElementById('pair')
    let base  = document.getElementById('base')
    let quote = document.getElementById('quote')
    for (let p of intersection) {
      let d = p.pair.indexOf('-'), b = p.pair.slice(0, d), q = p.pair.slice(d + 1)
      if (!found(base, o => o.text == b)) {
        let bo = document.createElement("option")
        bo.value = bo.text = b; base.add(bo)
      }
      if (!found(quote, o => o.text == q)) {
        let qo = document.createElement("option")
        qo.value = qo.text = q; quote.add(qo)
      }
    }
    pair.hidden = false
  }

  function found (c, p) {
    result = false
    for (const item of c) {
      if (result = p(item)) {
        break
      }
    }
    return result;
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
