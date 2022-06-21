import * as BASEDATA from "../../src/data_manager/bd.js";
import { generateId } from "../../src/data_manager/ud.js";
import * as MAP from "../../src/dom/map.js";

export const on = {
    click: (data, dataKey, save_id) => {}
}

const organizeFilters = (filters) => {
    const filters_organized = [];
    for(let filter of filters) {
        if(filter.all) {
            filters_organized.push({dataKey: filter.dataKey, all: true});
        } else {
            if(!filters_organized.find(f => f.dataKey === filter.dataKey)) {
                filters_organized.push({dataKey: filter.dataKey, filters: []});
            }
            filters_organized.find(f => f.dataKey === filter.dataKey).filters.push({key: filter.key, val: filter.val});
        }
    }
    return filters_organized;
}  

export const setFilterToLeafmap = async (filters) => {
    MAP.clearLayers();
    const filters_organized = organizeFilters(filters);
    for(let filter of filters_organized) {
        const bd_table = BASEDATA.table.find(db => db.path === filter.dataKey);
        const {color, path} = bd_table;
        const geo_option = {
            style: (feature) => ({
                color: color,
                weight: 1,
            }),
            pointToLayer: (point, latlng) => L.marker(latlng, {
                icon: L.icon({
                    iconUrl: `database/json/${path}/icon/marker.svg`,
                    iconSize: [48, 48],
                    iconAnchor: [24, 48],
                    shadowUrl: `database/json/shadow.png`,
                    shadowSize: [64, 64],
                    shadowAnchor: [21, 41],
                }),
            })
        }
        if(filter.all) {
            BASEDATA.fetchAllData(filter.dataKey).then(data => {
                const Lcluster = L.markerClusterGroup();
                data.forEach(d => {
                    const save_id = generateId(filter.dataKey, data.key, d.id);
                    const geo = d.geo;
                    if(!geo) return;
                    const Lgeo = L.geoJSON(geo, geo_option);
                    Lgeo.on("click", () => on.click(d, filter.dataKey, save_id));
                    Lcluster.addLayer(Lgeo);
                });
                MAP.addLayer(Lcluster);
            });
        } else {
            const Lcluster = L.markerClusterGroup();
            for(let f of filter.filters) {
                BASEDATA.fetchData(filter.dataKey, f.key).then(data => {
                    if(data[0].geo.type === "Point") {
                        data.forEach(d => {
                            const save_id = generateId(filter.dataKey, f.key, d.id);
                            if(!d.geo) return;
                            const Lgeo = L.geoJSON(d.geo, geo_option);
                            Lgeo.on("click", () => on.click(d, filter.dataKey, save_id));
                            Lcluster.addLayer(Lgeo);
                        });
                    } else {
                        data.forEach(d => {
                            const save_id = generateId(filter.dataKey, f.key, d.id);
                            if(!d.geo) return;
                            const Lgeo = L.geoJSON(d.geo, geo_option);
                            Lgeo.on("click", () => on.click(d, filter.dataKey, save_id));
                            MAP.addLayer(Lgeo);
                        });
                    }
                });
            }
            MAP.addLayer(Lcluster);
        }
    }
}

export const getPosFromGeo = (geo) => {
    if(geo.type === "Point") {
        return geo.coordinates;
    } else if(geo.type === "Polygon") {
        const coords = geo.coordinates[0];
        let sum = [0, 0];
        for(let coord of coords) {
            sum[0] += coord[0];
            sum[1] += coord[1];
        }
        return [sum[0]/coords.length, sum[1]/coords.length];
    } else if(geo.type === "MultiPolygon") {
        const coords = geo.coordinates[0][0];
        let sum = [0, 0];
        for(let coord of coords) {
            sum[0] += coord[0];
            sum[1] += coord[1];
        }
        return [sum[0]/coords.length, sum[1]/coords.length];
    }
}