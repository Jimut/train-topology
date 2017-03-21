import * as d3 from 'd3';

// Initialize svg
const svg = d3.select('svg');
const margin = {top: 20, right: 20, bottom: 20, left: 20};
const width = +svg.attr('width') - margin.left - margin.right;
const height = +svg.attr('height') - margin.top - margin.bottom;
const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

// Make ranges
const x = d3.scaleLinear().rangeRound([0, width]);
const y = d3.scaleLinear().rangeRound([0, height]);
const line = d3.line()
  .x(d => x(d.x))
  .y(d => y(d.y));

let trackData;
let trainData;

// Make the json requests
d3.json('app/track-data.json', (err, data) => {
  if (err)
    console.warn(err);

  trackData = data;
  drawTracks(data);

  d3.json('app/train-data.json', (err, data) => {
    if (err)
      console.warn(err);

    trainData = data;
    drawTrains(data);
  });
});

function drawTracks (data) {
  // Set domains
  x.domain(d3.extent([...data.map(d => d.coords[0].x), ...data.map(d => d.coords[1].x)]));
  y.domain(d3.extent([...data.map(d => d.coords[0].y), ...data.map(d => d.coords[1].y)]));

  // Draw tracks
  g.append('g')
    .attr('class', 'track-wrapper')
    .selectAll('.track')
    .data(data).enter()
    .append('g')
    .attr('class', 'track')
    .attr('track-id', d => d.id)
    .append('path')
    .attr('d', d => (line(d.coords)));
}

function drawTrains (data) {
  // Calculate coordinates of train's path
  data = data.map(train => {
    let coords = [];

    train.tracks.forEach(track => {
      let tr = trackData.find(trData => (trData.id === track));

      coords.push(...tr.coords);
    });

    train.coords = coords;
    return train;
  });

  // Draw trains
  g.append('g')
    .attr('class', 'train-wrapper')
    .selectAll('.train')
    .data(data).enter()
    .append('g')
    .attr('class', 'train')
    .attr('train-id', d => d.id)
    .append('path')
    .attr('d', d => (line(d.coords)));
}
