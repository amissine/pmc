class Bitfinex {
  static get (q) {
    console.log(q)
    if (q.pair) { // TODO fetch orderbook
    } else {      // TODO fetch all symbols
    }
    //return JSON.stringify(q);
  }
}
module.exports = Bitfinex
