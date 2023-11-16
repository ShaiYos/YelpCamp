
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v12',
    center: camp.geometry.coordinates,
    //pitch: 60,
    //bearing: -60,
    zoom: 8
  });

map.addControl(new mapboxgl.NavigationControl())

new mapboxgl.Marker()
  .setLngLat(camp.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset: 25})
      .setHTML(
          `<h5>${camp.title}</h5><p>${camp.location}</p>`
      )
  )
  .addTo(map)