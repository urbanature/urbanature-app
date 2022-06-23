import { delay } from "../misc.js";

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

const getMapPosition = () => {
    return {
        x: parseInt($map.css('--x')),
        y: parseInt($map.css('--y')),
        w: parseInt($map.css('--w')),
        h: parseInt($map.css('--h')),
    }
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

export const on = {
    /** @type {(e: L.LeafletEvent) => void} */
    click: (e) => {},
}

export const unhideMap = async ($dom) => {
    const {x:mx, y:my, w:mw, h:mh} = getMapPosition();
    if(mx + mw < 0 || mx > $dom.width() || my + mh < 0 || my > $dom.height() || $('#map-here').length === 0) return;
    $map.attr("data-transition", "none");
    $map.removeClass('hidden');
    await delay(1);
    $map.attr("data-transition", "");
}

export const updateMapPosition = async ($dom, animated = true) => {
    const $map_here = $('#map-here');
    $map.css("z-index", "100");
    if($map_here.length === 0) {
        mapTransitionTimer = 50;
        moveMap(-1, -1, 0, 0);
        $map.addClass("hidden");
        $map.css("z-index", "");
        return;
    }
    const x = $map_here.offset().left - $dom.offset().left;
    const y = $map_here.offset().top - $dom.offset().top;
    const w = $map_here.width();
    const h = $map_here.height();
    if(!animated) mapTransitionTimer = 50;
    // if $map was outside of the viewport, no animation
    const {x:mx, y:my, w:mw, h:mh} = getMapPosition();
    if(mx + mw < 0 || mx > $dom.width() || my + mh < 0 || my > $dom.height()) {
        mapTransitionTimer = 50;
    }
    if($map_here.data("map-show") == false) {
        $map.addClass("hidden");
    } else {
        $map.removeClass("hidden");
    }
    // if $map_here is outside of the viewport, no animation
    if(x < 0 || y < 0 || x + w > $(window).width() || y + h > $(window).height()) {
        mapTransitionTimer = 50;
        moveMap(x, y, w, h);
        await delay(50);
    } else {
        moveMap(x, y, w, h);
        await delay(500);
    }
    $map.css("z-index", "");
    updateMapSize();
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
            L.tileLayer(`https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`, {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            })
        ]
    });
    leafMap.zoomControl.setPosition('bottomright');
    const zoom_buttons = $(leafMap.zoomControl.getContainer());
    zoom_buttons.addClass("zoom-buttons");
    leafMapGroup.addTo(leafMap);
    leafMap.on("click", (e) => on.click(e));

    window.leafMap = leafMap;
    locate();
}

export const updateMapSize = () => {
    leafMap.invalidateSize();
}

export const mapControl = (enable = true, dom = $map.find(".leaflet-bottom.leaflet-right")) => {
    const zoom_buttons = $(leafMap.zoomControl.getContainer());
    zoom_buttons.attr("data-enabled", enable);
    zoom_buttons.appendTo(dom);
}

export const setPosition = ({lat, lng}, distance) => {
    // get zoom according to distance and leafMap bounds
    const zoom = leafMap.getBoundsZoom([
        [lat - distance[1], lng - distance[0]],
        [lat + distance[1], lng + distance[0]],
    ]);
    leafMap.setView([lat, lng], zoom);
}

export const pinLocation = async () => {
    if(!leafMap) return;
    await locate();
    setPosition(geoloc);
}

export const addLayer = (layer) => {
    // layer.on("click", (e) => {
    //     on.click(e);
    // });
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
