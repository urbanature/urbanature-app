import * as BASEDATA from "./data_manager/bd.js";
import { levenstein } from "../vendors_cpy/levenstein.js";

const includes = (a, b) => {
    return a?.toLowerCase().includes(b?.toLowerCase());
}
const equals = (a, b) => {
    return a?.toLowerCase() === b?.toLowerCase();
}

export const searchByKeyInDB = async (dbName, keyName, searchText) => {
    console.log(`searchByKeyInDB(${dbName}, ${keyName}, ${searchText})`);
    const {table: dbs, key_path, name_path} = BASEDATA.getTableMetaData(dbName);
    const searches = searchText.split(" ");
    const searchResult = [];
    let alreadyScanned = undefined;
    for(let key of [key_path, name_path]) {
        if(key === keyName) {
            let tkey;
            switch(key) {
                case key_path:
                    tkey = "key";
                    break;
                case name_path:
                    tkey = "name";
                    break;
                default: throw new Error(`unknown key ${key}`);
            }
            const some_dbs = dbs.filter(t => searches.some(s => includes(String(t[tkey]), s)));
            if(some_dbs.length > 0) {
                for(let db of some_dbs) {
                    searchResult.push(db);
                    console.log(`Scanning ${db.key} by shortcut`);
                    const d = await BASEDATA.fetchData(dbName, db.key);
                    if(equals(db[tkey], searchText)) {
                        return d;
                    } else {
                        searchResult.push(...d);
                        alreadyScanned = db;
                    }
                }
            }
            break;
        }
    }
    for(const db of dbs) {
        if(db === alreadyScanned) continue;
        console.log(`Scanning ${db.key}`);
        const d = await BASEDATA.fetchData(dbName, db.key);
        const data = d.filter(d => searches.some(s => includes(eval(`d.${keyName}`), s)));
        if(data) {
            searchResult.push(...data);
        }
    }
    searchResult.sort((a, b) => {
        const l = searches.map(s => levenstein(eval(`a.${keyName}`), s)).reduce((a, b) => a + b, 0) - searches.map(s => levenstein(eval(`b.${keyName}`), s)).reduce((a, b) => a + b, 0);
        if(l === 0) {
            return a.key?.localeCompare(b.key);
        }
        return l;
    });
    return searchResult;
}

export const searchByKeyInDBWithLimit = async (dbName, keyName, searchText, limit) => {
    const search = await searchByKeyInDB(dbName, keyName, searchText);
    return search.slice(0, limit);
}

export const searchByKeyEverywhere = async (keyName, searchText) => {
    const searchResult = [];
    for(const dbName of BASEDATA.getDatabases()) {
        const search = await searchByKeyInDB(dbName, keyName, searchText);
        searchResult.push({dbName, result: search});
    }
    return searchResult;
}

export const searchByKeyEverywhereWithLimit = async (keyName, searchText, limit) => {
    const searchResult = [];
    for(const dbName of BASEDATA.getDatabases()) {
        const search = await searchByKeyInDBWithLimit(dbName, keyName, searchText, limit);
        searchResult.push({dbName, result: search});
    }
    return searchResult;
}

