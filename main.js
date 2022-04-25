import { onStart, openFirstPage } from "./src/dom/dom.js";
import { mapControl } from "./src/dom/map.js";
import { updateVh } from "./src/misc.js";

import { accueil__setMap, accueil__mapCursor } from "./pages/accueil/script.js";
import { explorer__unhide } from "./pages/explorer/script.js";

$(window).on('resize', updateVh);
updateVh();


onStart.accueil = () => {
    accueil__setMap();
    accueil__mapCursor();
    mapControl(false);
}

onStart.explorer = () => {
    explorer__unhide();
    mapControl(true, $(".hud"));
}

openFirstPage('accueil');
