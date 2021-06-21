#!/usr/bin/env bash

unset CDPATH # to prevent unexpected `cd` behavior

pushd public
[ -L pm3 ] || ln -s ../pm3 pm3
[ -L binance.js ] || ln -s ../binance.js binance.js
[ -L coinbase.js ] || ln -s ../coinbase.js coinbase.js
popd
