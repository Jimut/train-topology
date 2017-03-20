import d3 from 'd3';

const svg = d3.select('svg');
const margin = {top: 20, right: 20, bottom: 30, left: 50};
const width = +svg.attr('width') - margin.left - margin.right;
const height = +svg.attr('height') - margin.top - margin.bottom;
const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
