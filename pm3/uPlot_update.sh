#!/usr/bin/env bash

if [ "$1" == 'build' ]; then
  cd $HOME/product/uPlot
  npm run-script build
cd -
fi
cp $HOME/product/uPlot/dist/uPlot.min.css pm3/
cp $HOME/product/uPlot/dist/uPlot.iife.min.js pm3/
