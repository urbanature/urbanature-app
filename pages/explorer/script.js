import * as MAP from "../../src/dom/map.js";
import * as BASEDATA from "../../src/data_manager/bd.js";
import { delay, imgToSvg } from "../../src/misc.js";
import { $_filter, $_subcategory } from "./el.js";
import { setFilterToLeafmap } from "./leaf.js";
import { contextClose } from "./context.js";

const cond = {
    hasTransition: false
}

export const explorer__unhide = async () => {
    await delay(200);
    $(".hud").removeClass("hud--hide");
}
export const explorer__hide = async () => {
    $(".hud").addClass("hud--hide");
    await delay(200);
}

const menuShow = () => {
    $(".menu").addClass("menu--show");
}
const menuHide = () => {
    $(".menu").removeClass("menu--show");
}

const searchShow = () => {
    $(".search").addClass("search--show");
}
const searchHide = () => {
    $(".search").removeClass("search--show");
}

export const explorer__manageMenu = () => {
    $("#filters-on").on("click", () => {
        contextClose();
        menuShow();
    });
    $("#search-on").on("click", () => {
        contextClose();
        searchShow();
    });
    $("#filters-off").on("click", () => {
        contextClose();
        menuHide();
    });
    $("#search-off").on("click", () => {
        contextClose();
        searchHide();
    });
}

let active_filters = [];
export const explorer__init = async () => {
    active_filters = [];
    const $menu__categories = $(".menu__categories");
    for (let cate of BASEDATA.categories) {
        $(`<section class="category" id="${cate.key}"><h2 class="category__title">${cate.name}</h2></section>`).appendTo($menu__categories);
    }
    for (let db of BASEDATA.table) {
        const {name, category, path, table} = db;
        const $sc = $_subcategory(name, name).appendTo(`.category#${category}`);
        const $ul = $sc.find(".filterlist");
        for (let t of table) {
            const $f = $_filter(name, t.key, `${t.name} (${t.length})`).appendTo($ul);
            $f.find("input").on("change", () => {
                if ($f.find("input").prop("checked")) {
                    active_filters.push({dataKey: path, key: t.key, val: t.name});
                } else {
                    active_filters = active_filters.filter(f => f.key !== t.key);
                }
                setFilterToLeafmap(active_filters);
            });
        }
    }
    imgToSvg();
    $(".category__title--subcategory").on("click", function(e) {
        const isExpanded = ($(this).parent().attr("data-expanded") === "true");
        $(this).parent().attr("data-expanded", !isExpanded);
    });
}

export const explorer__initMenu = async () => {
    if(BASEDATA.flags.loaded) {
        explorer__init();
    } else {
        BASEDATA.on.load = explorer__init;
    }
}

export const explorer__initGeoloc = async () => {
    const $geoloc = $("#geolocate");
    $geoloc.on("click", () => {
        MAP.pinLocation();
    });
}

export { initContext as explorer__initContext } from "./context.js";
