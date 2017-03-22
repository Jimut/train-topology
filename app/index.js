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
    this.defs = this.svg.append('defs');
    this.g = this.svg.append('g').attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // Make ranges
    this.x = d3.scaleLinear().rangeRound([0, this.width]);
    this.y = d3.scaleLinear().rangeRound([0, this.height]);
    this.line = d3.line()
      .x(d => this.x(d.x))
      .y(d => this.y(d.y));

    // Make the data requests and draw
    this.render();
  }

  render () {
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
        this._drawMarkers();
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
      let coords = [...train.extent];

      train.tracks.forEach((track, i) => {
        if (i === 0)
          return;

        let tr = this.trackData.find(trData => (trData.id === track));

        let a0 = coords[coords.length-2].x - tr.coords[0].x;
        let b0 = coords[coords.length-2].y - tr.coords[0].y;
        let a1 = coords[coords.length-2].x - tr.coords[1].x;
        let b1 = coords[coords.length-2].y - tr.coords[1].y;
        let closest = Math.sqrt(a0*a0 + b0*b0) < Math.sqrt(a1*a1 + b1*b1) ? tr.coords[0] : tr.coords[1];

        coords.splice(coords.length-1, 0, closest);
      });

      train.coords = coords;
      return train;
    });
    console.log(data);

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
      .attr('marker-start', d => `url(#train-direction-marker__${d.color})`)
      .attr('d', d => (this.line(d.coords)));
  }

  _drawMarkers () {
    let colors = [];
    this.trainData.forEach(train => {
      if (!colors.includes(train.color)) {
        colors.push(train.color);
      }
    });

    this.defs.selectAll('marker')
      .data(colors).enter()
      .append('marker')
      .attr('id', color => `train-direction-marker__${color}`)
      .attr('viewBox', '0 0 100 100')
      .attr('refX', '50')
      .attr('refY', '50')
      .attr('markerWidth', '8')
      .attr('markerHeight', '8')
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'm75.64904,10.92821l-53.14904,42.80909l55,35.33448c-14.78371,-30.32738 -14.87185,-45.55115 -1.85096,-78.14357z')
      .attr('transform', 'rotate(180 50,50) translate(0,-4)')
      .attr('fill', color => color)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', '5');
  }
}

var options = {
  trackDataUrl: 'app/track-data.json',
  trainDataUrl: 'app/train-data.json'
};
window.addEventListener('load', _ => (window.topology = new Topology(options)));
