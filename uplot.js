const windowSize = 120000; // {{{1
const datasize = 1000;
const data = [
  Array(datasize).fill(null),
  Array(datasize).fill(null),
  Array(datasize).fill(null),
  Array(datasize).fill(null),
];
const data2 = [
  Array(datasize).fill(null),
  Array(datasize).fill(null),
  Array(datasize).fill(null),
  Array(datasize).fill(null),
]
const scales = {
  x: {},
  y: {
    auto: false,
    range: [-500, +500]
  }
}

function recvTradesXLM (exchangeIdx, umf) { // TODO splice umf into chart data {{{1
  if (data[0].length < umf.length) {
    throw 'data[0].length '+data.length+', umf.length '+umf.length
  }
  if (data[0].length == umf.length) {
    for (let i = 0; i < umf.length; i++) {
      data[0]              [i] = umf[i].time
      data[1 + exchangeIdx][i] = umf[i].price
      data2[0]              [i] = umf[i].time
      data2[1 + exchangeIdx][i] = umf[i].amount
    }
    return;
  }
  for (let i = 0; i < umf.length; i++) {
    data[0].shift(); data[0].push(umf[i].time)
    data[1 + exchangeIdx].shift(); data[1 + exchangeIdx].push(umf[i].price)
    data2[0].shift(); data2[0].push(umf[i].time)
    data2[1 + exchangeIdx].shift(); data2[1 + exchangeIdx].push(umf[i].amount)
  }
}

function getSize() { // {{{1
  return {
    width: window.innerWidth - 20,
    height: window.innerHeight  / 4,
  }
}

const opts1 = { // {{{1
  title: "Latest XLM prices",
  ...getSize(),
  ms: 1,
  series: // {{{2
  [ 
    {},
    {
      stroke: "red",
      label: 'kraken',
      paths: uPlot.paths.linear(),
      spanGaps: true,
      points: { show: true }
    },
    {
      stroke: "blue",
      label: 'bitfinex',
      paths: uPlot.paths.spline(),
      spanGaps: true,
      points: { show: true }
    },
    {
      stroke: "purple",
      label: 'coinbase',
      paths: uPlot.paths.stepped({align: 1}),
      spanGaps: true,
      points: { show: true }
    },
  ], // }}}2
};

let u1 = new uPlot(opts1, data, document.getElementById('chart1')); // {{{1

const opts2 = { // {{{1
  title: "Latest XLM amounts",
  scales,
  ...getSize(),
  pxAlign: 0,
  ms: 1,
  pxSnap: false,
  series: // {{{2
  [
    {},
    {
      stroke: "red",
      label: 'kraken',
      paths: uPlot.paths.linear(),
      spanGaps: true,
      pxAlign: 0,
      points: { show: true }
    },
    {
      stroke: "blue",
      label: 'bitfinex',
      paths: uPlot.paths.spline(),
      spanGaps: true,
      pxAlign: 0,
      points: { show: true }
    },
    {
      stroke: "purple",
      label: 'coinbase',
      paths: uPlot.paths.bars(),
      spanGaps: true,
      pxAlign: 0,
      points: { show: true }
    },
  ], // }}}2
};

let u2 = new uPlot(opts2, data, document.getElementById('chart2')); // {{{1

let freeze = false // {{{1
//let updateCount = 0
function update()
{
  /*switch (updateCount++) {
    case 0:
      console.time('updateCount')
      break
    case 60:
      console.timeEnd('updateCount') // updateCount: 1022ms - timer ended
  }*/
  const now 	= Date.now();
  const scale = {min: now - windowSize, max: now};

  u1.setData(data);
  u2.setData(data2);
  u1.setScale('x', scale);
  u2.setScale('x', scale);
  if (!freeze) {
    requestAnimationFrame(update)
  }
}

update()
