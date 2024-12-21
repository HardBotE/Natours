const locations= JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken = 'pk.eyJ1IjoicmF3bGFuZC0iLCJhIjoiY200eTVoamtiMHgzMDJsczhiZWZsdnUwaCJ9.fZ8LEHijAUoVLrJ_Mur3Qw';

let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11',
  scrollZoom:false


});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(location => {

  const el = document.createElement('div');
  el.className = 'marker';

  new mapboxgl.Marker({
    element:el,
    anchor: 'bottom'
  }).setLngLat(location.coordinates).addTo(map);

  bounds.extend(location.coordinates);

  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(location.coordinates)
    .setHTML(`<p>Day ${location.day}: ${location.description} </p>`)
    .addTo(map);

});

map.fitBounds(bounds,{
  padding:{
    top:200,
    bottom:200,
    left:100,
    right:100
  }
});