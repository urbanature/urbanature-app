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

export const getMarkerOption = (dataKey) => {
    const bd_table = BASEDATA.table.find(db => db.path === dataKey);
    const {color, path} = bd_table;
    return {
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
}

export const placeMarker = (dataKey, key, data) => {
    const save_id = generateId(dataKey, key, data.id);
    const geo = data.geo;
    if(!geo) return;
    const geo_option = getMarkerOption(dataKey);
    const Lgeo = L.geoJSON(geo, geo_option);
    Lgeo.on("click", () => on.click(data, dataKey, save_id));
    return Lgeo;
}


export const setFilterToLeafmap = async (filters) => {
    MAP.clearLayers();
    const filters_organized = organizeFilters(filters);
    for(let filter of filters_organized) {
        if(filter.all) {
            BASEDATA.fetchAllData(filter.dataKey).then(data => {
                const Lcluster = L.markerClusterGroup();
                data.forEach(d => {
                    const Lgeo = placeMarker(filter.dataKey, data.key, d);
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
                            const Lgeo = placeMarker(filter.dataKey, f.key, d);
                            Lcluster.addLayer(Lgeo);
                        });
                    } else {
                        data.forEach(d => {
                            const Lgeo = placeMarker(filter.dataKey, f.key, d);
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
    let coordinates = [];
    let sum = [0, 0];
    let min = [Number.MAX_VALUE, Number.MAX_VALUE];
    let max = [Number.MIN_VALUE, Number.MIN_VALUE];
    let count = 0;
    if(geo.type === "Point") {
        coordinates = geo.coordinates;
        min = coordinates;
        max = coordinates;
        count++;
    } else if(geo.type === "Polygon") {
        for(let i = 0; i < geo.coordinates.length; i++) {
            for(let j = 0; j < geo.coordinates[i].length; j++) {
                sum[0] += geo.coordinates[i][j][0];
                sum[1] += geo.coordinates[i][j][1];
                if(min[0] > geo.coordinates[i][j][0]) min[0] = geo.coordinates[i][j][0];
                if(min[1] > geo.coordinates[i][j][1]) min[1] = geo.coordinates[i][j][1];
                if(max[0] < geo.coordinates[i][j][0]) max[0] = geo.coordinates[i][j][0];
                if(max[1] < geo.coordinates[i][j][1]) max[1] = geo.coordinates[i][j][1];
                count++;
            }
        }
        coordinates = [sum[0]/count, sum[1]/count];
    } else if(geo.type === "MultiPolygon") {
        for(let i = 0; i < geo.coordinates.length; i++) {
            for(let j = 0; j < geo.coordinates[i].length; j++) {
                for(let k = 0; k < geo.coordinates[i][j].length; k++) {
                    sum[0] += geo.coordinates[i][j][k][0];
                    sum[1] += geo.coordinates[i][j][k][1];
                    if(min[0] > geo.coordinates[i][j][k][0]) min[0] = geo.coordinates[i][j][k][0];
                    if(min[1] > geo.coordinates[i][j][k][1]) min[1] = geo.coordinates[i][j][k][1];
                    if(max[0] < geo.coordinates[i][j][k][0]) max[0] = geo.coordinates[i][j][k][0];
                    if(max[1] < geo.coordinates[i][j][k][1]) max[1] = geo.coordinates[i][j][k][1];
                    count++;
                }
            }
        }
        coordinates = [sum[0]/count, sum[1]/count];
    }
    const distance = [
        Math.abs(max[0] - min[0]),
        Math.abs(max[1] - min[1]),
    ]
    return [coordinates, distance]
}