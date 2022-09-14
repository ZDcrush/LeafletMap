//==============创建5、10、15分钟可到达的服务区
// Layer Group for source point
const startLayerGroup = L.layerGroup().addTo(map);

// Layer Group for service area results
const layerGroup = L.layerGroup().addTo(map);//const

// Create the arcgis-rest-js authentication object to use later.
const authentication = arcgisRest.ApiKeyManager.fromKey(apiKey);

// When the map is clicked, call the service area REST service with the
// clicked point and display the results.
document.getElementById("ServerArea-btn").value = "OpenServerArea";
function ServerArea() {//点击按钮触发最短路径开关
    if (document.getElementById("ServerArea-btn").value == "OpenServerArea") {
        document.getElementById("ServerArea-btn").value = "CloseServerArea";

        map.on("contextmenu", (e) => {
            // Clear the previous results
            startLayerGroup.clearLayers();
            layerGroup.clearLayers();

            // Add the source point
            L.marker(e.latlng).addTo(startLayerGroup);

            // Make the API request
            arcgisRest
                .serviceArea({
                    endpoint: "https://route-api.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World/solveServiceArea",
                    authentication,
                    facilities: [[e.latlng.lng, e.latlng.lat]]
                })
                .then((response) => {
                    // Show the result route on the map.
                    L.geoJSON(response.saPolygons.geoJson, {
                        style: (feature) => {
                            const style = {
                                fillOpacity: 0.5,
                                weight: 1
                            };
                            if (feature.properties.FromBreak === 0) {
                                style.color = "hsl(210, 80%, 40%)";
                            } else if (feature.properties.FromBreak === 5) {
                                style.color = "hsl(210, 80%, 60%)";
                            } else {
                                style.color = "hsl(210, 80%, 80%)";
                            }
                            return style;
                        }
                    }).addTo(layerGroup);
                })
                .catch((error) => {
                    console.error(error);
                    alert("There was a problem using the route service. See the console for details.");
                });
        });
    }
    else if (document.getElementById("ServerArea-btn").value == "CloseServerArea") {
        document.getElementById("ServerArea-btn").value = "OpenServerArea";
        // feature.properties.FromBreak="l";
        // Clear the previous results
        startLayerGroup.clearLayers();
        layerGroup.clearLayers();
        map.off("contextmenu");//移除右击事件

    }
};

//=====================最短路径
// Add a DOM Node to display the text routing directions
const directions = document.createElement("div");
directions.id = "directions";
directions.innerHTML = "Click on the map to create a start and end for the route.";
document.body.appendChild(directions);

// Layer Group for start/end-points
const startPathLayerGroup = L.layerGroup().addTo(map);
const endLayerGroup = L.layerGroup().addTo(map);

// Layer Group for route lines
const routeLines = L.layerGroup().addTo(map);

let currentStep = "start";
let startCoords, endCoords;

function updateRoute() {
    // Create the arcgis-rest-js authentication object to use later.
    const authentication = arcgisRest.ApiKeyManager.fromKey(apiKey);

    // make the API request
    arcgisRest
        .solveRoute({
            stops: [startCoords, endCoords],
            endpoint: "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve",
            authentication
        })
        .then((response) => {
            // Show the result route on the map.
            routeLines.clearLayers();
            L.geoJSON(response.routes.geoJson).addTo(routeLines);

            // Show the result text directions on the map.
            const directionsHTML = response.directions[0].features.map((f) => f.attributes.text).join("<br/>");
            directions.innerHTML = directionsHTML;
            startCoords = null;
            endCoords = null;
        })
        .catch((error) => {
            console.error(error);
            alert("There was a problem using the route service. See the console for details.");
        });
}

// state, and pass them to the updateRoute function which calls the REST endpoint.
document.getElementById("Path-btn").value = "OpenRoute";//设置路劲按钮的值
function SearchRoutePath() {//点击按钮触发最短路径开关
    if (document.getElementById("Path-btn").value == "OpenRoute") {
        document.getElementById("Path-btn").value = "CloseRoute";

        directions.innerHTML = "Click on the map to create a start and end for the route.";
        // When the map is clicked, get the coordinates, store the start or end
        map.on("click", (e) => {
            const coordinates = [e.latlng.lng, e.latlng.lat];

            if (currentStep === "start") {
                startPathLayerGroup.clearLayers();
                endLayerGroup.clearLayers();
                routeLines.clearLayers();
                L.marker(e.latlng).addTo(startPathLayerGroup);
                startCoords = coordinates;
                currentStep = "end";
            } else if (currentStep === "end") {
                L.marker(e.latlng).addTo(endLayerGroup);
                endCoords = coordinates;
                currentStep = "start";
            }

            if (startCoords && endCoords) {
                updateRoute();
            }
        });

    }
    else if (document.getElementById("Path-btn").value == "CloseRoute") {
        document.getElementById("Path-btn").value = "OpenRoute";
        directions.innerHTML = "Close start and end for the route.";
        // currentStep = "stop";//停止标记开始和结束点的计数
        // //清除路劲图层和标点
        startPathLayerGroup.clearLayers();
        endLayerGroup.clearLayers();
        routeLines.clearLayers();
        map.off("click");//移除单击事件
    }
};