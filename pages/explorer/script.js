import * as BASE_DATA from "../../src/data_manager/basedata.js";
import * as MAP from "../../src/dom/map.js";
import { imgToSvg } from "../../src/misc.js";
import { $_filter, $_subcategory } from "./el.js";
import { setFilterToLeafmap } from "./leaf.js";
import { delay } from "/src/misc.js";

export const explorer__unhide = async () => {
    await delay(500);
    $(".hud").removeClass("hud--hide");
}
export const explorer__hide = async () => {
    $(".hud").addClass("hud--hide");
    await delay(500);
}

const menuShow = () => {
    $(".menu").addClass("menu--show");
}
const menuHide = () => {
    $(".menu").removeClass("menu--show");
}

export const explorer__manageMenu = () => {
    $(".button--menu").on("click", () => {
        menuShow();
    });
    $(".menu__close").on("click", () => {
        menuHide();
    });
}

let active_filters = [];

export const explorer__init = async () => {
    active_filters = [];
    const dataKeys = BASE_DATA.getDataKeys();
    for(let key of dataKeys.sort()) {
        const {name, data, filter} = BASE_DATA.GLOBAL_DATA[key];
        const $sc = $_subcategory(key, name).appendTo(".category");
        const $ul = $sc.find(".filterlist");
        if(filter) {
            for(let f of filter.filters) {
                const $f = $_filter(f.key, f.val, f.nom).appendTo($ul);
                $f.find("input").on("change", () => {
                    if($f.find("input").prop("checked")) {
                        active_filters.push({dataKey: key, key: f.key, val: f.val});
                    } else {
                        active_filters = active_filters.filter(f => f.key !== f.key);
                    }
                    setFilterToLeafmap(active_filters);
                });
                if(BASE_DATA.DEFAULT_DATA.data === data) {
                    $f.find("input").prop("checked", true).trigger("change");
                }
            }
        } else {
            const $f = $_filter(key, name, name).appendTo($ul);
            $f.find("input").on("change", () => {
                if($f.find("input").prop("checked")) {
                    active_filters.push({dataKey: key, all: true});
                } else {
                    active_filters = active_filters.filter(f => f.dataKey !== key);
                }
                setFilterToLeafmap(active_filters);
            });
            if(BASE_DATA.DEFAULT_DATA.data === data) {
                $f.find("input").prop("checked", true).trigger("change");
            }
        }
    }
    imgToSvg();
    $(".category__title--subcategory").on("click", function(e) {
        const isExpanded = ($(this).parent().attr("data-expanded") === "true");
        $(this).parent().attr("data-expanded", !isExpanded);
    });
}

export const explorer__initMenu = async () => {
    if(BASE_DATA.flags.loaded) {
        explorer__init();
    } else {
        BASE_DATA.on.load = explorer__init;
    }
}

export const explorer__initGeoloc = async () => {
    const $geoloc = $("#geolocate");
    $geoloc.on("click", () => {
        MAP.pinLocation();
    });
}
