const $map = $('#__dom__map');

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

