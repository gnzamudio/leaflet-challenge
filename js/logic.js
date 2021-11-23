const url= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function getcolor(d){
    return d > 1000 ? '#800026' :
    d >= 90  ? '#BD0026' :
    d >= 80  ? '#E31A1C' :
    d >= 60  ? '#FC4E2A' :
    d >= 40   ? '#FD8D3C' :
    d >= 20   ? '#FEB24C' :
    d >= 10   ? '#FED976' :
               '#FFEDA0';
}

//function to create map
//1. stretmap, 2. baseMap, 3. overlayer, where the map opens, control map

function createMap(earthquakes){
    var streetmap= L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    var baseMap= {
        "Street Map": streetmap
    };
    var overlayMap= {
        "Erthquakes": earthquakes
    };
    var map= L.map('map', {
        center: [36.9664, -120.8440],
        zoom: 1.5,
        layers: [streetmap, earthquakes]
      });

    L.control.layers(baseMap, overlayMap, {
        collapse: false
    }).addTo(map);

    //add legend
    var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function (map) {
 
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [10, 20, 40, 60, 80, 90];


        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getcolor(grades[i]) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
   
            }
            

        return div;
    };
    legend.addTo(map);
}

// function for markers in map

function createMarkers(response) {
    var features = response.features;
    var earthquakeMarkers = [];
    for (var i = 0; i < features.length; i++) {

        var earthquake = features[i];
        var mag = earthquake.properties.mag;
        var depthColor = getcolor(earthquake.geometry.coordinates[2]);

        var earthquakeMarker = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
            radius: mag * 10000,
            color:  depthColor
        }).bindPopup("<h3>URL: " + earthquake.properties.url + 
            "</h3><h3>Time: " + earthquake.properties.time + "</h3>" +
            "</h3><h3>Title: " + earthquake.properties.title + "</h3>" +
            "</h3><h3>Place: " + earthquake.properties.place + "</h3>" +
            "</h3><h3>Magnitude: " + earthquake.properties.mag + "</h3>" +
            "</h3><h3>Depth: " + earthquake.geometry.coordinates[2] + "</h3>" 
        );

        earthquakeMarkers.push(earthquakeMarker);
    }
    // Create layer group from the markers array, and pass it to the createMap function.
    createMap(L.layerGroup(earthquakeMarkers));
}


// call the url
d3.json(url).then(createMarkers);

d3.json(url).then(data => {
    console.log(data);
});
