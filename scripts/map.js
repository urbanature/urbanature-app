import { sleep } from "./async.js";

let mapTransitionTimer = 0;

const map = document.getElementById("__dom__map");

setInterval(() => {
    if(mapTransitionTimer <= 0) {
        map.dataset.transition = "";
    } else {
        map.dataset.transition = "none";
        mapTransitionTimer--;
    }
}, 1);

const placeMap = (map, x, y, w, h, animate) => {
    if(!animate) mapTransitionTimer = 10;
    map.style.setProperty("--x", x);
    map.style.setProperty("--y", y);
    map.style.setProperty("--w", w);
    map.style.setProperty("--h", h);
}

const putMap = event => {
    const mapLoc = document.getElementById("map-here");
    if(map && mapLoc) {
        placeMap(map,
            mapLoc.offsetLeft - event.target.scrollLeft, 
            mapLoc.offsetTop - event.target.scrollTop,
            mapLoc.offsetWidth, 
            mapLoc.offsetHeight,
        false);
    }
};

export const updateMap = () => {
    const page = document.getElementById("__dom__page");
    page.removeEventListener("scroll", putMap);
    const mapLoc = document.getElementById("map-here");
    if(map && mapLoc) {
        placeMap(map, mapLoc.offsetLeft, mapLoc.offsetTop, mapLoc.offsetWidth, mapLoc.offsetHeight, true);
    } else {
        console.info("No map to place");
        placeMap(map, 0, 0, 0, 0, true);
    }
    page.addEventListener("scroll", putMap);
}
