import { onStart, openFirstPage } from "./src/dom/dom.js";
import { updateVh } from "./src/misc.js";

import { accueil__setMap, accueil__mapCursor } from "./pages/accueil/script.js";
import { explorer__start } from "./pages/explorer/script.js";

$(window).on('resize', updateVh);
updateVh();


onStart.accueil = () => {
    accueil__setMap();
    accueil__mapCursor();
}

onStart.explorer = () => {
    explorer__start();
}

openFirstPage('accueil');