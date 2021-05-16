const windowSize = 120000; // {{{1
const size = 1000;
const data = [
  Array(size).fill(null),
  Array(size).fill(null),
  Array(size).fill(null),
  Array(size).fill(null),
];

function recvTradesXLM (exchangeIdx, umf) { // TODO splice umf into chart data {{{1
  if (data[0].length < umf.length) {
    throw 'data[0].length '+data.length+', umf.length '+umf.length
  }
  if (data[0].length == umf.length) {
    for (let i = 0; i < umf.length; i++) {
      data[0]              [i] = umf[i].time
      data[1 + exchangeIdx][i] = umf[i].price
    }
    return;
  }
  for (let i = 0; i < umf.length; i++) {
    data[0].shift(); data[0].push(umf[i].time)
    data[1 + exchangeIdx].shift(); data[1 + exchangeIdx].push(umf[i].price)
  }
}

function getSize() { // {{{1
  return {
    width: window.innerWidth - 20,
    height: window.innerHeight  / 4,
  }
}

const scales = { // {{{1
  x: {},
  y: {
    auto: false,
    range: [-3.2, 0.2]
  }
};

const opts1 = { // {{{1
  title: "Latest events",
  ...getSize(),
  ms: 1,
  //scales,
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
				title: "Aggregated history",
				...getSize(),
				pxAlign: 0,
				ms: 1,
				scales,
				pxSnap: false,
				series: // {{{2
				[
					{},
					{
						stroke: "red",
						paths: uPlot.paths.linear(),
						spanGaps: true,
						pxAlign: 0,
						points: { show: true }
					},
					{
						stroke: "blue",
						paths: uPlot.paths.spline(),
						spanGaps: true,
						pxAlign: 0,
						points: { show: true }
					},
					{
						stroke: "purple",
						paths: uPlot.paths.stepped({align: 1, pxSnap: false}),
						spanGaps: true,
						pxAlign: 0,
						points: { show: true }
					},
				], // }}}2
			};

			let u2 = new uPlot(opts2, data, document.getElementById('chart2')); // {{{1

function update() // {{{1
{
  const now 	= Date.now();
  const scale = {min: now - windowSize, max: now};

  u1.setData(data);
  u2.setData(data);
  u1.setScale('x', scale);
  u2.setScale('x', scale);
  requestAnimationFrame(update);
}

requestAnimationFrame(update)
