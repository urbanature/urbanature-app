const $map = $('#__dom__map');

/** @type {L.Map} */
let leafMap = null;
let leafMapGroup = L.layerGroup();

let mapTransitionTimer = 0;

let geoloc = {
    lat: 0,
    lng: 0,
    layer: null,
};

setInterval(() => {
    if(mapTransitionTimer <= 0) {
        $map.attr("data-transition", "");
    } else {
        $map.attr("data-transition", "none");
        mapTransitionTimer--;
    }
}, 1);

const moveMap = (x, y, w, h) => {
    $map.css({
        '--x': x,
        '--y': y,
        '--w': w,
        '--h': h
    });
}

const locate = () => new Promise((resolve, reject) => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            geoloc.lat = pos.coords.latitude;
            geoloc.lng = pos.coords.longitude;
            if(geoloc.layer) {
                geoloc.layer.setLatLng([geoloc.lat, geoloc.lng]);
            } else {
                geoloc.layer = L.marker([geoloc.lat, geoloc.lng]).addTo(leafMap);
            }
            resolve();
        });
    } else {
        reject();
    }
});

export const updateMapPosition = ($dom, animated = true) => {
    const $map_here = $('#map-here');
    if($map_here.length === 0) {
        moveMap(0, 0, 0, 0);
        return;
    }
    if(!animated) mapTransitionTimer = 50;
    if($map_here.data("map-show") == false) {
        $map.addClass("hidden");
    } else {
        $map.removeClass("hidden");
    }
    moveMap(
        $map_here.offset().left - $dom.offset().left,
        $map_here.offset().top - $dom.offset().top,
        $map_here.width(),
        $map_here.height()
    );
}

export const initMap = () => {
    leafMap = L.map($map[0], {
        center: [48.856614, 2.3522219],
        zoom: 12,
        zoomOffset: 0,
        // detectRetina: true,
        // zoomControl: false,
        // attributionControl: false,
        // dragging: false,
        // tap: false,
        // scrollWheelZoom: false,
        layers: [
            L.tileLayer(`https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png`, {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            })
        ]
    });
    leafMap.zoomControl.setPosition('bottomright');
    const zoom_buttons = $(leafMap.zoomControl.getContainer());
    zoom_buttons.addClass("zoom-buttons");
    leafMapGroup.addTo(leafMap);
    window.leafMap = leafMap;
    locate();
}

export const updateMapSize = () => {
    leafMap.invalidateSize();
}

export const mapControl = (enable = true, dom = $map) => {
    const zoom_buttons = $(leafMap.zoomControl.getContainer());
    zoom_buttons.attr("data-enabled", enable);
    zoom_buttons.appendTo(dom);
}

export const pinLocation = async () => {
    if(!leafMap) return;
    await locate();
    leafMap.setView([geoloc.lat, geoloc.lng], 16);
}

export const addLayer = (layer) => {
    leafMapGroup.addLayer(layer);
}
export const removeLayer = (layer) => {
    leafMapGroup.removeLayer(layer);
}
export const toggleLayer = (layer) => {
    if(leafMapGroup.hasLayer(layer)) {
        leafMapGroup.removeLayer(layer);
    } else {
        leafMapGroup.addLayer(layer);
    }
}
export const clearLayers = () => {
    leafMapGroup.eachLayer(layer => {
        if(layer.options.layerType !== "tile") {
            leafMapGroup.removeLayer(layer);
        }
    });
}
