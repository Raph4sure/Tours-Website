const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoicmFwaDRzdXJlIiwiYSI6ImNsejc4YmkyNTA3NnYya3M4NzhnYWt1ZWUifQ.tqtB9Zrn12r7CsmPOJzdow';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11'
});
