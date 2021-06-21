#!/usr/bin/env node

const express = require('express')
const app = express()

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const server = app.listen(5000, () => {
  let sa = server.address()
  console.log('- listening at http://%s:%s', sa.address, sa.port)
})
