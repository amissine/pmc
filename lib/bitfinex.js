const https = require('https')

class Bitfinex {
  static get (req, res) {
    if (req.query.pair) { // TODO fetch orderbook
      jsonOrderbook(req.query.pair, res)
    } else {
      jsonAllSymbols(res)
    }
  }
}
module.exports = Bitfinex

function jsonAllSymbols (response) {
  doGet('https://api-pub.bitfinex.com/v2/tickers?symbols=ALL', response)
}

function jsonOrderbook(pair, response) {
  doGet(`https://api-pub.bitfinex.com/v2/book/${pair}/P0`, response)
}

function doGet (url, response) {
  https.get(url, res => {
    const { statusCode } = res
    const contentType = res.headers['content-type']
    let error = statusCode != 200 ? new Error(`Bad statusCode ${statusCode}`) :
      !/^application\/json/.test(contentType) ? new Error(`Bad contentType ${contentType}`) : null
    if (error) {
      console.error(error.message)
      res.resume()
      return;
    }
    res.setEncoding('utf8')
    let json = ''
    res.on('data', chunk => { json += chunk })
    res.on('end', () => {
      response.end(json)
    })
  }).on('error', error => { console.error(error.message) })
}
