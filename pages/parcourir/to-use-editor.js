import * as USERDATA from "../../src/data_manager/ud.js";
import { imgToSvg } from "../../src/misc.js";

const gen_template = async (url) => _.template(await fetch(url).then(res => res.text()));

const array_eq = (a, b) => a.every((v, i) => v === b[i]);

const menu = [
    "favoris",
    "liste",
    "meta",
];

const selectMenu = (menu_id) => menu[menu_id % menu.length];

/** @param {[]} parcours */
const fill_favoris = async (parcours) => {
    const $favlist = $("#favoris").find(".section__list");
    $favlist.empty();
    const favoris = await USERDATA.getFavorisAsync();
    const favitem_check = await gen_template("pages/parcourir/template/favitem_check.html");
    for(let fav of favoris) {
        if(fav.item.geo.type !== "Point") continue;
        const html = favitem_check({
            name: fav.item.nom,
            addr: "addresse",
            sid: fav.sid
        });
        const $item = $(html).appendTo($favlist);
        const $input = $item.find("input");
        if(parcours.find(p => array_eq(p, fav.sid))) {
            $input.prop("checked", true);
        }
        $input.on("change", async (e) => {
            const checked = $(e.target).prop("checked");
            // parcours is const
            if(checked) {
                parcours.push(fav.sid);
            } else {
                parcours.splice(parcours.findIndex(p => array_eq(p, fav.sid)), 1);
            }
        });
    }
}

/** @param {[]} parcours @param {[L.LayerGroup, L.LayerGroup]} param2 @param {L.Map} map */
const fill_parcours = async (parcours, [map_markers, map_path], map) => {
    const $liste = $("#liste").find(".section__list");
    $liste.empty();
    const favoris = await USERDATA.getFavorisAsync();
    const favitem_drag = await gen_template("pages/parcourir/template/favitem_drag.html");
    map_markers.clearLayers();
    map_path.clearLayers();
    map.invalidateSize();
    let coords = [];
    for(let sid of parcours) {
        const fav = favoris.find(f => array_eq(f.sid, sid));
        if(!fav) continue;
        console.log(fav.item)
        const html = favitem_drag({
            name: fav.item.nom,
            addr: fav.item.adresse,
            sid: fav.sid
        });
        const $item = $(html).appendTo($liste);
        const popup = L.popup({closeButton: false})
            .setContent(`<p>${fav.item.nom}</p>`)
        L.geoJSON(fav.item.geo)
            .bindPopup(popup)
            .addTo(map_markers);
        coords.push([...fav.item.geo.coordinates].reverse());
    }
    if(coords.length > 1) {
        const path = L.polyline(coords, {color: "#ff0000"});
        map_path.addLayer(path);
    }
    const marker_group = L.featureGroup(map_markers.getLayers());
    try {map.fitBounds(marker_group.getBounds());} catch(e) {}
    $liste.sortable({
        axis: "y",
        handle: ".favitem__drag",
        update: (e, ui) => {
            const p = [...parcours];
            while(parcours.length) parcours.pop();
            for(let el of $liste.children()) {
                const $el = $(el);
                const sid = $el.data("sid").split(",");
                const item = p.find(p => array_eq(p, sid));
                parcours.push(item);
            }
            map_path.clearLayers();
            coords = [];
            for(let sid of parcours) {
                const fav = favoris.find(f => array_eq(f.sid, sid));
                if(!fav) continue;
                coords.push([...fav.item.geo.coordinates].reverse());
            }
            if(coords.length > 1) {
                const path = L.polyline(coords, {color: "#ff0000"});
                map_path.addLayer(path);
            }
        }
    });
}

const fill_meta = async (meta) => {
    $("#parcours-id").val(meta.id || USERDATA.getNextParcoursId());
    $("#parcours-name").val(meta.name || "");
    // $("#parcours-img").val(meta.img || "");
}

const export_parcours = async (parcours, meta) => {
    if(USERDATA.getParcoursById(meta.id)) {
        USERDATA.updateParcours(meta.id, {parcours, ...meta});
    } else {
        USERDATA.addParcours({parcours, ...meta});
    }
}


export const editor = async () => {
    let menu_select = 0;
    let menu_current = selectMenu(menu_select);
    const parcours = [];

    const hash = window.location.hash.substring(1);
    const splitted = hash.split(".");
    const parcours_id = splitted[1];
    const got_parcours = USERDATA.getParcoursById(parcours_id);
    let meta = {};
    if(got_parcours) {
        meta.id = got_parcours.id;
        meta.name = got_parcours.name;
        // meta.img = got_parcours.img;
        parcours.push(...got_parcours.parcours);
        $("#example-name").text(meta.name);
        // $("#example-img").attr("src", meta.img);
    }

    const map = L.map("map-preview", {
        layers: [
            L.tileLayer(`https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`, {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            })
        ]
    }).setView([48.856614, 2.3522219], 13);
    const map_markers = L.layerGroup().addTo(map);
    const map_path = L.layerGroup().addTo(map);
    

    const open_menu = async () => {
        $(".section").removeClass("section--view");
        $(`#${menu_current}`).addClass("section--view");
        switch(menu_current) {
            case "favoris":
                await fill_favoris(parcours);
                $(".edithead__button[data-nav='prev']").addClass("edithead__button--hidden");
                $(".edithead__button[data-nav='next']").removeClass("edithead__button--hidden");
                break;
            case "liste":
                $(".edithead__button[data-nav='prev']").removeClass("edithead__button--hidden");
                $(".edithead__button[data-nav='next']").removeClass("edithead__button--hidden");
                await fill_parcours(parcours, [map_markers, map_path], map);
                break;
            case "meta":
                $(".edithead__button[data-nav='prev']").removeClass("edithead__button--hidden");
                $(".edithead__button[data-nav='next']").addClass("edithead__button--hidden");
                await fill_meta(meta);
                break;
        }
        imgToSvg();
    }
    $("#parcours-submit").on("click", async () => {
        meta.id = $("#parcours-id").val();
        meta.name = $("#parcours-name").val();
        // meta.img = $("#parcours-img").val();
        await export_parcours(parcours, meta);
        $("a[href='parcourir']").trigger("click");
    });
    $("#parcours-name").on("input", async () => {
        $("#example-name").text($("#parcours-name").val());
    });
    // $("#parcours-img").on("change", async () => {
    //     $("#example-img").attr("src", $("#parcours-img").val());
    // });

    $(".edithead__button").on("click", async function(e) {
        switch($(this).data("nav")) {
            case "prev":
                if(menu_select > 0) menu_select--;
                break;
            case "next":
                if(menu_select < menu.length - 1) menu_select++;
                break;
        }
        menu_current = selectMenu(menu_select);
        await open_menu();
    });
    await open_menu();
}
