import * as d3 from 'd3';

class Topology {
  constructor (options) {
    this.trackDataUrl = options.trackDataUrl;
    this.trainDataUrl = options.trainDataUrl;

    // Initialize svg
    this.svg = d3.select('svg');
    this.margin = {top: 20, right: 20, bottom: 20, left: 20};
    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;
    this.g = this.svg.append('g').attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // Make ranges
    this.x = d3.scaleLinear().rangeRound([0, this.width]);
    this.y = d3.scaleLinear().rangeRound([0, this.height]);
    this.line = d3.line()
      .x(d => this.x(d.x))
      .y(d => this.y(d.y));

    // Make the data requests and draw
    d3.json(this.trackDataUrl, (err, data) => {
      if (err)
        console.warn(err);

      this.trackData = data;
      this._drawTracks();

      d3.json(this.trainDataUrl, (err, data) => {
        if (err)
          console.warn(err);

        this.trainData = data;
        this._drawTrains();
      });
    });
  }

  _drawTracks () {
    let data = this.trackData;

    // Set domains
    this.x.domain(d3.extent([...data.map(d => d.coords[0].x), ...data.map(d => d.coords[1].x)]));
    this.y.domain(d3.extent([...data.map(d => d.coords[0].y), ...data.map(d => d.coords[1].y)]));

    // Draw tracks
    this.g.append('g')
      .attr('class', 'track-wrapper')
      .selectAll('.track')
      .data(data).enter()
      .append('g')
      .attr('class', 'track')
      .attr('track-id', d => d.id)
      .append('path')
      .attr('d', d => (this.line(d.coords)));
  }

  _drawTrains () {
    let data = this.trainData;

    // Calculate coordinates of train's path
    data = data.map(train => {
      let coords = [];

      train.tracks.forEach(track => {
        let tr = this.trackData.find(trData => (trData.id === track));

        coords.push(...tr.coords);
      });

      train.coords = coords;
      return train;
    });

    // Draw trains
    this.g.append('g')
      .attr('class', 'train-wrapper')
      .selectAll('.train')
      .data(data).enter()
      .append('g')
      .attr('class', 'train')
      .attr('train-id', d => d.id)
      .append('path')
      .attr('stroke', d => d.color)
      .attr('d', d => (this.line(d.coords)));

    document.querySelectorAll('.train > path').forEach(elm => {
      let len = elm.getTotalLength();

      let id = elm.parentNode.getAttribute('train-id');
      let completion = this.trainData.find(tn => (tn.id === id)).completion;
      completion = completion.substr(0, 2)/100;

      elm.setAttribute('stroke-dasharray', len);
      elm.setAttribute('stroke-dashoffset', len * completion);
    });
  }
}

var options = {
  trackDataUrl: 'app/track-data.json',
  trainDataUrl: 'app/train-data.json'
};
window.addEventListener('load', _ => new Topology(options));
