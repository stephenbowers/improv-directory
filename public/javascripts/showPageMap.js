mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: theater.geometry.coordinates, // starting position [lng, lat]
    zoom: 8 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(theater.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
            .setHTML(
                `<h3>${theater.title}</h3><p>${theater.location}</p>`
            )
    )
    .addTo(map)