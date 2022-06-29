import * as DATABASE from "../../src/data_manager/bd.js";

const setGeoOption = table => ({
    style: (feature) => ({
        color: table.color,
        weight: 1,
    }),
    pointToLayer: (point, latlng) => L.marker(latlng, {
        icon: L.icon({
            iconUrl: `database/json/${table.path}/icon/marker.svg`,
            iconSize: [48, 48],
            iconAnchor: [24, 48],
            shadowUrl: `database/json/shadow.png`,
            shadowSize: [64, 64],
            shadowAnchor: [21, 41],
        }),
    })
})

const setMapData = async (map1_layer, map2_layer) => {
    const categories = await fetch("database/json/categories.json").then(res => res.json());
    const table1 = DATABASE.table.find(t => t.demo && t.category === categories[0].key);
    const table2 = DATABASE.table.find(t => t.demo && t.category === categories[1].key);

    const data1 = await DATABASE.fetchData(table1.path, table1.demo);
    const data2 = await DATABASE.fetchData(table2.path, table2.demo);
    
    data1.forEach(d => {
        const geo = d.geo;
        const Lgeo = L.geoJSON(geo, setGeoOption(table1));
        map1_layer.addLayer(Lgeo);
    });
    data2.forEach(d => {
        const geo = d.geo;
        const Lgeo = L.geoJSON(geo, setGeoOption(table2));
        map2_layer.addLayer(Lgeo);
    });
}

export const accueil__setMap = async () => {
    const $map1 = $("#map-one div")[0];
    const $map2 = $("#map-two div")[0];

    const map1 = L.map($map1, {
        center: [48.856614, 2.3522219],
        zoom: 12,
        zoomOffset: 0,
        detectRetina: true,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        tap: false,
        scrollWheelZoom: false,
        layers: [
            L.tileLayer(`https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`, {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            })
        ]
    });

    const map2 = L.map($map2, {
        center: [48.856614, 2.3522219],
        zoom: 12,
        zoomOffset: 0,
        detectRetina: true,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        tap: false,
        scrollWheelZoom: false,
        layers: [
            L.tileLayer(`https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`, {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            })
        ]
    });

    const map1_layer = L.layerGroup().addTo(map1);
    const map2_layer = L.layerGroup().addTo(map2);

    if(DATABASE.flags.loaded) {
        setMapData(map1_layer, map2_layer);
    } else {
        DATABASE.onload(() => {
            setMapData(map1_layer, map2_layer);
        })
    }
}

export const accueil__mapCursor = () => {
    const $cursor = $('#map-cursor');
    const $maps = $('[data-info="map"]');
    const cursorState = {
        isChanging: false,
        position: $cursor.offset().left,
    };
    $cursor.on('mousedown touchstart', e => {
        cursorState.isChanging = true;
    });
    $cursor.on('mouseup touchend', e => {
        cursorState.isChanging = false;
    });
    $cursor.on('mousemove touchmove', e => {
        const pageMargin = parseInt($cursor.css('--page-margin'));
        if (cursorState.isChanging) {
            cursorState.position = ((e.clientX || e.touches[0].clientX) - $cursor.width() - pageMargin) * 100 / $maps.width();
            if(cursorState.position < 0) cursorState.position = 0;
            if(cursorState.position > 100) cursorState.position = 100;
            $maps.css('--cover', `${cursorState.position}%`);
        }
    });
}

export const accueil__initExplorer = async () => {
    const categories = await fetch("database/json/categories.json").then(res => res.json());
    const table = await fetch("database/json/table.json").then(res => res.json());
    const explogroup_ = await fetch("pages/accueil/templates/explogroup.html").then(res => res.text());
    const explobox_ = await fetch("pages/accueil/templates/explobox.html").then(res => res.text());
    $(_.template(explogroup_)({
        categories,
        capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
    })).appendTo("#explo-groups");
    categories.forEach(category => {
        category.count = 0;
    });
    for(let t of table) {
        const cate = categories.find(c => c.key === t.category);
        if(!cate) continue;
        if(cate.count > 3) continue;
        cate.count++;
        let path = (t.type === "time") ? `${t.path}.${t.demo}` : t.path;
        $(_.template(explobox_)({
            ...t,
            path_href: path,
            capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
        })).appendTo(`#explo-${t.category}`);
    }
    categories.forEach(category => {
        while(category.count < 4) {
            $(_.template(explobox_)({
                ...{
                    name: "",
                    path: "",
                    path_href: "",
                },
                capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
            })).appendTo(`#explo-${category.key}`);
            category.count++;
        }
    });
}