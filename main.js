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
      intersectionUpdate(e.data)
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
    for (let o of base) {
      o.onclick = baseSelected
    }
    for (let o of quote) {
      o.onclick = quoteSelected
    }

    function quoteSelected (e) {
      let b = pairCheck(base, (b, q, v) => b == v && q == e.target.value, e)
      if (b > 0) {
        console.log(base[b].value + '-' + e.target.value)
      }
    }

    function pairCheck (counterpart, cb, e) {
      if (e.target.value.length == 0) {
        for (let o of e.target.parentElement) {
          o.disabled = false
        }
        for (let o of counterpart) {
          o.disabled = false
        }
        counterpart.selectedIndex = 0
        return 0;
      }
      if (counterpart.selectedIndex > 0) {
        return counterpart.selectedIndex;
      }
      for (let o of counterpart) {
        if (!intersection.find(p => {
          let separator = p.pair.indexOf('-'),
            base  = p.pair.slice(0, separator),
            quote = p.pair.slice(1 + separator)
          return cb(base, quote, o.value);
        })) {
          if (o.value.length > 0) {
            o.disabled = true
          }
        }
      }
      return 0;
    }

    function baseSelected (e) {
      let q = pairCheck(quote, (b, q, v) => q == v && b == e.target.value, e)
      if (q > 0) {
        console.log(e.target.value + '-' + quote[q].value)
      }
    }

    pair.hidden = false
  }

  function found (c, p) {
    for (const item of c) {
      if (p(item)) {
        return true
      }
    }
    return false;
  }

  function intersectionUpdate (pairs) {
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
