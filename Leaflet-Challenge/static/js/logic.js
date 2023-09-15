// URL for earthquake data
const earthquakeDataURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// color ranges for earthquakes
const Colors = ['#1a9850', '#91cf60', '#d9ef8b', '#fee08b', '#fc8d59', '#d73027'];

// marker color based on earthquake
function getColor(d) {
    const depthRanges = [-10, 10, 30, 50, 70, 90];
    return Colors.find((color, index) => d > depthRanges[index]) || Colors[0];
}

// popup content for an earthquake
function createPopupContent(feature) {
    const { geometry, properties } = feature;
    const [longitude, latitude, depth] = geometry.coordinates;
    const { mag, place } = properties;
    
    return `
        Longitude: ${longitude}<br>
        Latitude: ${latitude}<br>
        Location: ${place}<br>
        Magnitude: ${mag}<br>
        Depth: ${depth}<br>
    `;
}

// initialize map
function initMap() {
    const map = L.map('map').setView([37.954585, -116.884660], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    return map;
}

// earthquake marker
function addMarkerToMap(map, feature) {
    const { geometry } = feature;
    const [latitude, longitude] = geometry.coordinates;
    const marker = L.circleMarker([latitude, longitude], {
        radius: feature.properties.mag * 5,
        fillColor: getColor(geometry.coordinates[2]),
        color: 'white',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7,
    }).addTo(map);
    marker.bindPopup(createPopupContent(feature));
}

// legend
function createLegend(map) {
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'legend');
        const depths = [-10, 10, 30, 50, 70, 90];
        
        depths.forEach((depth, index) => {
            div.innerHTML +=
                `<i style="background:${Colors[index + 1]}"></i> ${depth}${depths[index + 1] ? '&ndash;' + depths[index + 1] + '<br>' : '+'}`;
        });
        return div;
    };
    legend.addTo(map);
}

// errors
function handleError(error) {
    console.error("An error occurred:", error);
}

// initialize the map and display earthquake data
function init() {
    d3.json(earthquakeDataURL)
        .then(function(json_data) {
            const map = initMap();
            json_data.features.forEach(feature => addMarkerToMap(map, feature));
            createLegend(map);
        })
        .catch(handleError);
}

//run it 
init();
