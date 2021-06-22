#!/usr/bin/env node
// See also:
// https://www.tutorialspoint.com/nodejs/nodejs_express_framework.htm
const express = require('express')
const app = express()
const Bitfinex = require('../lib/bitfinex')

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
app.get('/bitfinex', (req, res) => {
  res.end(Bitfinex.get(req.query))
})
const server = app.listen(5000, () => {
  let sa = server.address()
  console.log('- listening at http://%s:%s', sa.address, sa.port)
})
