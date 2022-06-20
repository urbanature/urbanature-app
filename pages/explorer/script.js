import * as MAP from "../../src/dom/map.js";
import * as BASEDATA from "../../src/data_manager/bd.js";
import { delay, imgToSvg } from "../../src/misc.js";
import { $_filter, $_subcategory } from "./el.js";
import { on, setFilterToLeafmap } from "./leaf.js";
import { contextClose } from "./context.js";
import { addToQuery, getHash, getQueryString } from "../../src/history.js";

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

// filter:
//  {dataKey: "arbres", key: "Platanus", val: "Platane"}
// query:
//  ?filter=arbres.Platanus,arbres.Juglans
let active_filters = [];

const getFiltersFromQuery = () => {
    const query = getQueryString();
    const output = [];
    if(!query.filter) return output;
    const filters = query.filter.split(",");
    for(let i = 0; i < filters.length; i++) {
        const filter = filters[i].split(".");
        if(filter.length === 1) {
            output.push({
                dataKey: filter[0],
                all: true
            });
        } else {
            output.push({
                dataKey: filter[0],
                key: filter[1]
            });
        }
    }
    return output;
}
const updateQueryFromActiveFilters = () => {
    const filters = [];
    for(let i = 0; i < active_filters.length; i++) {
        const filter = active_filters[i];
        filters.push(filter.dataKey + "." + filter.key);
    }
    addToQuery({filter: filters.join(",")}, true, true);
}


export const explorer__init = async () => {
    active_filters = [];
    const $menu__categories = $(".menu__categories");
    for (let cate of BASEDATA.categories) {
        $(`<section class="category" id="${cate.key}"><h2 class="category__title">${cate.name}</h2></section>`).appendTo($menu__categories);
    }
    for (let db of BASEDATA.table) {
        const {name, category, path, table} = db;
        const $sc = $_subcategory(path, name).appendTo(`.category#${category}`);
        const $ul = $sc.find(".filterlist");
        table.sort((a, b) => {
            const na = a.name ? a.name : a.key;
            const nb = b.name ? b.name : b.key;
            return na.localeCompare(nb);
        });
        for (let t of table) {
            const $f = $_filter(path, t.key, `${t.name} (${t.length})`).appendTo($ul);
            $f.find("input").on("change", () => {
                if ($f.find("input").prop("checked")) {
                    active_filters.push({dataKey: path, key: t.key, val: t.name});
                } else {
                    active_filters = active_filters.filter(f => f.key !== t.key);
                }
                setFilterToLeafmap(active_filters);
                updateQueryFromActiveFilters();
            });
        }
        $sc.find(".subcategory__uncheck").on("click", function(e) {
            $sc.find("input:checked").trigger("click");
        });
    }
    imgToSvg();
    $(".category__title--subcategory").on("click", function(e) {
        const isExpanded = ($(this).parent().attr("data-expanded") === "true");
        $(this).parent().attr("data-expanded", !isExpanded);
    });
    const filter_query = getFiltersFromQuery();
    console.log(filter_query);
    if (filter_query.length > 0) {
        filter_query.forEach(f => {
            if(f.all) {
                $($(`input[data-key="${f.dataKey}"]`)).trigger("click");
            } else {
                $(`input[data-key="${f.dataKey}"][data-val="${f.key}"]`).trigger("click");
            }
        });
    }
    const hash = getHash();
    if(hash) {
        // hash would be a string like "arbres,Ailanthus,79d07d616f896be24e69dd383c922d4901efcca5"
        const [dataKey, key, val] = hash.split(",");
        const table = await BASEDATA.fetchData(dataKey, key);
        const t = table.find(t => t.id === val);
        if(t) {
            active_filters.push({dataKey, key, val: t.name});
            setFilterToLeafmap(active_filters);
            updateQueryFromActiveFilters();
            on.click(t, dataKey, [dataKey, key, val]);
        }
    }
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
export { initSearch as explorer__initSearch } from "./search.js";
