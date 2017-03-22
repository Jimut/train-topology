import * as d3 from 'd3';
import Topology from './Topology';

var options = {
  trackDataUrl: 'app/track-data.json',
  trainDataUrl: 'app/train-data.json'
};
window.addEventListener('load', _ => (window.topology = new Topology(options)));
