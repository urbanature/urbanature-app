const map1 = document.querySelector("#map-one div");
const map2 = document.querySelector("#map-two div");

L.map(map1, {
    center: [48.856614, 2.3522219],
    zoom: 12,
    zoomOffset: 0,
    detectRetina: true,
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    tap: false,
    scrollWheelZoom: false,
    layers: [
        L.tileLayer(`https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png`, {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
    ]
});

L.map(map2, {
    center: [48.856614, 2.3522219],
    zoom: 12,
    zoomOffset: 0,
    detectRetina: true,
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    tap: false,
    scrollWheelZoom: false,
    layers: [
        L.tileLayer(`https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png`, {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
    ]
});
