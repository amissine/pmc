class Agg { // {{{1
  constructor(paneInSeconds) {
    this.paneMs = paneInSeconds * 1000
    this.pt = this.b = this.s = this.o = this.h = this.l = this.c = +0
  }
  _agg (qt, cb, aggregate) {
    if (this.pt > 0) {
      if (qt > this.pt) {
        this.pt = qt; cb(qt)
      }
    } else { // start aggregation
      this.pt = qt
    }
    aggregate()
  }
  bs (t, a, cb) {
    this._agg(t - t % this.paneMs, 
      qt => { cb(qt, this.b, this.s); this.b = this.s = +0 },
      () => { if (a > 0) this.b += a; else this.s += a })
  }
  ohlc (t, p, cb) {
    this._agg(t - t % this.paneMs,
      qt => { cb(qt, this.o, this.h, this.l, this.c); this.o = +0 },
      () => {
        if (this.o == 0) {
          this.o = this.h = this.l = this.c = p; return;
        }
        if (this.h < p) this.h = p
        else if (this.l > p) this.l = p
        this.c = p
      })
  }
}

class TimeSeries { // {{{1
  constructor (noOfExchanges) {
    this.noOfExchanges = noOfExchanges
  }
  _ts (count) {
    let a = [ [] ]
    for (let i = 0; i < count; i++) {
      a.push([])
    }
    return a;
  }
  get history() {
    return this._ts(this.noOfExchanges * 6); // buy, sell, o, h, l, c
  }
  get amounts() {
    return this._ts(this.noOfExchanges * 2); // buy, sell amounts
  }
  get trades() {
    return this._ts(this.noOfExchanges); // prices
  }
}
