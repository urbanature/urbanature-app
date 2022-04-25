const $map = $('#__dom__map');

let leafMap = null;

let mapTransitionTimer = 0;

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

export const updateMapPosition = ($dom, animated = true) => {
    const $map_here = $('#map-here');
    if($map_here.length === 0) return;
    if(!animated) mapTransitionTimer = 50;
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
        detectRetina: true,
        // zoomControl: false,
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
    leafMap.zoomControl.setPosition('bottomright');
    const zoom_buttons = $(leafMap.zoomControl.getContainer());
    zoom_buttons.addClass("zoom-buttons");
}

export const updateMapSize = () => {
    leafMap.invalidateSize();
}

export const mapControl = (enable = true, dom = $map) => {
    const zoom_buttons = $(leafMap.zoomControl.getContainer());
    zoom_buttons.attr("data-enabled", enable);
    zoom_buttons.appendTo(dom)
}
