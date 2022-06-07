import * as BASEDATA from "../../src/data_manager/bd.js";
import * as MAP from "../../src/dom/map.js";

export const on = {
    click: (data, dataKey) => {}
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
        const {marker, path} = bd_table;
        const geo_option = {
            style: (feature) => ({
                color: marker.color,
                weight: 1,
            }),
            pointToLayer: (point, latlng) => L.marker(latlng, {
                icon: L.icon({
                    iconUrl: `/database/json/${path}/${marker.icon}`,
                    iconSize: [32, 32],
                    iconAnchor: marker.anchor.map(a => a/2),
                    shadowUrl: `/database/json/${path}/${marker.mask}`,
                    shadowSize: [32, 32],
                    shadowAnchor: marker.anchor.map(a => a/2),
                }),
            })
        }
        if(filter.all) {
            BASEDATA.fetchAllData(filter.dataKey).then(data => {
                const Lcluster = L.markerClusterGroup();
                data.forEach(d => {
                    const geo = d.geo;
                    if(!geo) return;
                    const Lgeo = L.geoJSON(geo, geo_option);
                    Lgeo.on("click", () => on.click(d, filter.dataKey));
                    Lcluster.addLayer(Lgeo);
                });
                MAP.addLayer(Lcluster);
            });
        } else {
            for(let f of filter.filters) {
                BASEDATA.fetchData(filter.dataKey, f.key).then(data => {
                    if(data[0].geo.type === "Point") {
                        const Lcluster = L.markerClusterGroup();
                        data.forEach(d => {
                            if(!d.geo) return;
                            const Lgeo = L.geoJSON(d.geo, geo_option);
                            Lgeo.on("click", () => on.click(d, filter.dataKey));
                            Lcluster.addLayer(Lgeo);
                        });
                        MAP.addLayer(Lcluster);
                    } else {
                        data.forEach(d => {
                            if(!d.geo) return;
                            const Lgeo = L.geoJSON(d.geo, geo_option);
                            Lgeo.on("click", () => on.click(d, filter.dataKey));
                            MAP.addLayer(Lgeo);
                        });
                    }
                });
            }
        }
    }
}
