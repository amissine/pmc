postMessage('ho')
onmessage = e => {
  console.log(e.data)
  postMessage('hoy')
}
