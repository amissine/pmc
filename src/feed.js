import arbitrage from './arbitrage.js'

export default function (data) {
  if (data == null) { // config feed
    console.log('- feed started')
    return;
  }
  arbitrage(data, ao)
}

let header = document.getElementById('header')

function ao ($) {
  header.textContent += ` $${Math.trunc($*100)/100}`
}
