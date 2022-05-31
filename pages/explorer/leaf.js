import * as BASE_DATA from "../../src/data_manager/basedata.js";
import * as MAP from "../../src/dom/map.js";
import { delay } from "../../src/misc.js";

export const setFilterToLeafmap = async (filters) => {
    MAP.clearLayers();
    const filters_organized = [];
    /** Template:
     * {dataKey, filters: [{key, value}]}
     */
    for(let filter of filters) {
        if(filter.all) {
            filters_organized.push({dataKey: filter.dataKey, all: true});
        } else {
            if(!filters_organized.find(f => f.dataKey === filter.dataKey)) {
                filters_organized.push({dataKey: filter.dataKey, filters: []});
            }
            filters_organized.find(f => f.dataKey === filter.dataKey).filters.push({key: filter.key, value: filter.val});
        }
    }

    for(let filter of filters_organized) {
        if(filter.all) {
            BASE_DATA.getFiltered(filter.dataKey).then(data => {
                data.forEach(d => MAP.addLayer(d.Lgeo));
            });
        } else {
            BASE_DATA.getFiltered(filter.dataKey, filter.filters).then(data => {
                data.forEach(d => MAP.addLayer(d.Lgeo));
            });
        }
    }
    console.log("Filters applied:", filters_organized);
}
