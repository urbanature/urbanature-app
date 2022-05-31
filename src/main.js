import { onClose, onStart, openFirstPage } from "./dom/dom.js";
import { mapControl } from "./dom/map.js";
import { updateVh } from "./misc.js";
import * as BASE_DATA from "./data_manager/basedata.js";
import * as USER_DATA from "./data_manager/userdata.js";
import { accueil__setMap, accueil__mapCursor } from "../pages/accueil/script.js";
import { explorer__unhide, explorer__hide, explorer__manageMenu, explorer__initMenu, explorer__initGeoloc } from "../pages/explorer/script.js";

$(window).on('resize', updateVh);
updateVh();

BASE_DATA.initData();
USER_DATA.initData();

onStart.accueil = () => {
    accueil__setMap();
    accueil__mapCursor();
    mapControl(false);
}
onClose.accueil = async () => {}

onStart.explorer = () => {
    explorer__unhide();
    explorer__manageMenu();
    mapControl(true, $(".hud"));
    explorer__initMenu();
    explorer__initGeoloc();
}
onClose.explorer = async () => {
    // await explorer__hide();
}

openFirstPage('accueil');
