import * as d3 from 'd3';

export default class Graph {
  constructor (options) {
    this.trainDataUrl = options.trainDataUrl;

    // Initialize svg
    this.svg = d3.select('svg#graph');
    this.margin = {top: 20, right: 20, bottom: 20, left: 20};
    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;
    this.defs = this.svg.append('defs');
    this.g = this.svg.append('g').attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // Make ranges
    this.x = d3.scaleLinear().rangeRound([0, this.width]);
    this.y = d3.scaleTime().rangeRound([0, this.height]);
    this.line = d3.line()
      .x(d => this.x(d.x))
      .y(d => this.y(d.y));

    this.timeParser = d3.timeParse('%H:%M:%S');

    // Make the data requests and draw
    this.render();
  }

  render () {
    d3.json(this.trainDataUrl, (err, data) => {
      if (err)
        console.warn(err);

        this.trainData = data;
        this._drawGraph();
    });
  }

  _drawGraph () {
    let data = this.trainData;


  }
}
