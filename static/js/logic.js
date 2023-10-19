// Initialize the map
let myMap = L.map("map", {
    center: [37.7749, -122.4194], 
    zoom: 5 
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
}).addTo(myMap);

let earthquakeDataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(earthquakeDataUrl).then(function(data) {
    
    function style(feature) {
        return {
            radius: feature.properties.mag * 5, 
            fillColor: getColor(feature.geometry.coordinates[2]), 
            color: "black", 
            weight: 1, 
            opacity: 1, 
            fillOpacity: 0.7 
        };
    }

    function getColor(depth) {
    
        if (depth > 90) return "red";
        else if (depth > 70) return "orange";
        else if (depth > 50) return "yellow";
        else if (depth > 30) return "green";
        else if (depth > 10) return "blue";
        else return "white";
    }

    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: style,
        onEachFeature: function(feature, layer) {
            
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>Magnitude: ${feature.properties.mag}`);
        }
    }).addTo(myMap);

    
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function(map) {
        let div = L.DomUtil.create("div", "info legend");
        let depths = [-10, 10, 30, 50, 70, 90];
        for (let i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
});
