//加入发布的图层
const statesCity = L.esri.featureLayer({
  // url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3",
  url: "http://541331e14b.51vip.biz:2005/arcgis/rest/services/ThePoliceStationInHarbinCitymap/MapServer/2",

  style: function (feature) {
    return { color: "#000000", weight: 2 };//加载的图层样式控制
  }
});
const statesCounty = L.esri.featureLayer({
  // url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3",
  url: "http://541331e14b.51vip.biz:2005/arcgis/rest/services/ThePoliceStationInHarbinCitymap/MapServer/1",

  style: function (feature) {
    return { color: "#808080", weight: 2 };//加载的图层样式控制
  }
});
const statesPoint = L.esri.featureLayer({
  url:
    "http://541331e14b.51vip.biz:2005/arcgis/rest/services/ThePoliceStationInHarbinCitymap/MapServer/0",
});

//发布多选图层的控件
const overlays = {
  "Harbin City": statesCity,
  "Harbin County":statesCounty,
  "Point coordinates in local police stations": statesPoint,
};

var map = L.map('ArcGISmapContainer', {
  layers: [statesCity, statesPoint]//默认打开的图层
}).setView([45.6, 126], 7)//([32.180188, 118.697804], 16);

const apiKey = "AAPKec5e7aae3d6241c9b83417e4a1f8ee21EMkj1hcFCF2_9p3hi6MN_k5jkiq_fzMv_hLfpU85MGFJEp7sHV-ODgWcnD-YM43n";

var vectorTiles = {};
var allEnums = [
  'ArcGIS:Imagery',
  'ArcGIS:Imagery:Standard',
  'ArcGIS:Imagery:Labels',
  'ArcGIS:LightGray',
  'ArcGIS:LightGray:Base',
  'ArcGIS:LightGray:Labels',
  'ArcGIS:DarkGray',
  'ArcGIS:DarkGray:Base',
  'ArcGIS:DarkGray:Labels',
  'ArcGIS:Navigation',
  'ArcGIS:NavigationNight',
  'ArcGIS:Streets',
  'ArcGIS:StreetsNight',
  'ArcGIS:StreetsRelief',
  'ArcGIS:StreetsRelief:Base',
  'ArcGIS:Topographic',
  'ArcGIS:Topographic:Base',
  'ArcGIS:Oceans',
  'ArcGIS:Oceans:Base',
  'ArcGIS:Oceans:Labels',
  'OSM:Standard',
  'OSM:StandardRelief',
  'OSM:StandardRelief:Base',
  'OSM:Streets',
  'OSM:StreetsRelief',
  'OSM:StreetsRelief:Base',
  'OSM:LightGray',
  'OSM:LightGray:Base',
  'OSM:LightGray:Labels',
  'OSM:DarkGray',
  'OSM-DarkGray:Base',
  'OSM-DarkGray:Labels',
  'ArcGIS:Terrain',
  'ArcGIS:Terrain:Base',
  'ArcGIS:Terrain:Detail',
  'ArcGIS:Community',
  'ArcGIS:ChartedTerritory',
  'ArcGIS:ChartedTerritory:Base',
  'ArcGIS:ColoredPencil',
  'ArcGIS:Nova',
  'ArcGIS:ModernAntique',
  'ArcGIS:ModernAntique:Base',
  'ArcGIS:Midcentury',
  'ArcGIS:Newspaper',
  'ArcGIS:Hillshade:Light',
  'ArcGIS:Hillshade:Dark'
];

// the L.esri.Vector.vectorBasemapLayer basemap enum defaults to 'ArcGIS:Streets' if omitted
vectorTiles.Default = L.esri.Vector.vectorBasemapLayer(null, {
  apiKey
});
allEnums.forEach((enumString) => {
  vectorTiles[
    enumString
  ] = L.esri.Vector.vectorBasemapLayer(enumString, {
    apiKey
  });
});



L.control
  .layers(vectorTiles, overlays, {  //(单选图层，多选图层（顺序不能变）{
    collapsed: true, //是否折叠
    position: 'bottomright',
  })
  .addTo(map);

vectorTiles.Default.addTo(map);//默认打开图层


// L.esri.tiledMapLayer({
//   url: 'http://192.168.31.87:6080/arcgis/rest/services/bowu/%E5%8D%9A%E7%89%A9%E9%A6%86/MapServer',
//   detectRetina: false,
//   // minZoom: 3,
//   // maxZoom: 10
// }).addTo(map);

// a Leaflet marker is used by default to symbolize point features.
// L.esri.featureLayer({
//     url: "http://192.168.31.87:6080/arcgis/rest/services/bowu/%E5%8D%9A%E7%89%A9%E9%A6%86/MapServer"
//   })
//   .addTo(map);

// add Leaflet-Geoman controls with some options to the map
map.pm.addControls({
  position: 'bottomleft',//（'topleft''topright''bottomleft''bottomright'）
  drawCircle: true,
});
// add Leaflet-Geoman controls with some options to the map
L.control.mousePosition().addTo(map);   //移动鼠标动态获得经纬度

//=======================地点搜索框
const searchControl = L.esri.Geocoding.geosearch({
position: "topright",
placeholder: "Enter an address or place e.g. 1 York St",
useMapBounds: false,
providers: [
  L.esri.Geocoding.arcgisOnlineProvider({
    apikey: apiKey,
    nearby: {
      lat: -33.8688,
      lng: 151.2093
    }
  })
]
}).addTo(map);

const results = L.layerGroup().addTo(map);

searchControl.on("results", (data) => {
results.clearLayers();
for (let i = data.results.length - 1; i >= 0; i--) {
  const lngLatString = `${Math.round(data.results[i].latlng.lng * 100000) / 100000}, ${
    Math.round(data.results[i].latlng.lat * 100000) / 100000
  }`;
  const marker = L.marker(data.results[i].latlng);
  marker.bindPopup(`<b>${lngLatString}</b><p>${data.results[i].properties.LongLabel}</p>`);
  results.addLayer(marker);
  marker.openPopup();
}
});

