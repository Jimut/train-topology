import * as d3 from 'd3';
import Topology from './Topology';

let options = {
  trackDataUrl: 'app/track-data.json',
  trainDataUrl: 'app/train-data.json'
};
window.addEventListener('DOMContentLoaded', _ => (window.topology = new Topology(options)));


console.log('This a test! Again Again');
