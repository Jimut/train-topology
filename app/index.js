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
  .y(d => y(d.y))
  .defined(true);


d3.json('app/data.json', (err, data) => {
  if (err)
    console.warn(err);

  // Set domains
  x.domain(d3.extent([...data.map(d => d.coords[0].x), ...data.map(d => d.coords[1].x)]));
  y.domain(d3.extent([...data.map(d => d.coords[0].y), ...data.map(d => d.coords[1].y)]));

  // Now draw
  let tracks = g.selectAll('.tracks').data(data)
    .enter().append('g')
    .attr('class', 'tracks')
    .append('path')
    .attr('d', d => (line(d.coords)));
});
