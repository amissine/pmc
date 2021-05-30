(function () {
  if (!window.Worker) {
    console.log('This browser doesn\'t support web workers.')
    return;
  }
  const worker = new Worker('worker.js')
  worker.onmessage = e => console.log(e.data)
  worker.postMessage('hi')
})()
