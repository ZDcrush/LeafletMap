const apiKey = "AAPKec5e7aae3d6241c9b83417e4a1f8ee21EMkj1hcFCF2_9p3hi6MN_k5jkiq_fzMv_hLfpU85MGFJEp7sHV-ODgWcnD-YM43n";

const gray = L.esri.Vector.vectorBasemapLayer("ArcGIS:LightGray", {
    apikey: apiKey
});
const states = L.esri.featureLayer({
    url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3",
    style: function (feature) {
        return { color: "#bada55", weight: 2 };
    }
});

const map = L.map("ArcGISmapContainer", {
    center: [39, -97.5],
    zoom: 4,
    layers: [gray, states]
});

const baseLayers = {
    Grayscale: gray,
    Newspaper: L.esri.Vector.vectorBasemapLayer("ArcGIS:Newspaper", {
        apikey: apiKey
    })
};

const overlays = {
    "U.S. States": states
};

// https://leafletjs.com/reference.html#control-layers
L.control.layers(baseLayers, overlays).addTo(map);