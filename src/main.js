import { explorer__manageMenu } from "../pages/explorer/script.js";
import { onStart, openFirstPage } from "./dom/dom.js";
import { mapControl } from "./dom/map.js";
import { updateVh } from "./misc.js";

import { accueil__setMap, accueil__mapCursor } from "/pages/accueil/script.js";
import { explorer__unhide } from "/pages/explorer/script.js";

$(window).on('resize', updateVh);
updateVh();


onStart.accueil = () => {
    accueil__setMap();
    accueil__mapCursor();
    mapControl(false);
}

onStart.explorer = () => {
    explorer__unhide();
    explorer__manageMenu();
    mapControl(true, $(".hud"));
}

openFirstPage('accueil');
