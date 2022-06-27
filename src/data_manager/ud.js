import { delay } from "../misc.js";
import * as BASEDATA from "./bd.js";

const GLOBALS = {
    storage: {
        favoris: [],
        recherches: {
            accueil: [],
            decouvrir: [],
            explorer: [],
            parcourir: [],
            profil: []
        },
        parcours: [],
    }
};

export const generateId = (dbname, keyName, id) => {
    return [dbname, keyName, id];
}
export const parseId = async ([dbname, keyName, id]) => {
    await new Promise(async (res, rej) => {
        if(BASEDATA.flags.loaded) res();
        BASEDATA.onload(res);
    })
    const table = await BASEDATA.fetchData(dbname, keyName);
    if(!table) return null;
    return table.find(({id: tid}) => tid === id);
}

export const loadStorage = () => {
    const ud_storage = localStorage.getItem('ud_storage') ?? "";
    const storage = LZString.decompress(ud_storage);
    let st = storage ? JSON.parse(storage) : {};
    return (GLOBALS.storage = {
        favoris: [],
        recherches: {
            accueil: [],
            decouvrir: [],
            explorer: [],
            parcourir: [],
            profil: []
        },
        parcours: [],
        ...st
    });
}
export const saveStorage = () => {
    const storage = JSON.stringify(GLOBALS.storage);
    const ud_storage = LZString.compress(storage);
    localStorage.setItem('ud_storage', ud_storage);
}
export const initData = () => {
    loadStorage();
    saveStorage();
    localStorage.setItem("Why does ud_storage look chinese?", "Enter the command getStorage() in the console to see the content of the storage.");
}
export const readUdStorage = () => {
    return JSON.parse(LZString.decompress(localStorage.ud_storage));
}

export const getFavoris = () => {
    return GLOBALS.storage.favoris.map(t => ({item: parseId(t), table: t[0]}));
}
export const getFavorisAsync = async () => {
    return await Promise.all(GLOBALS.storage.favoris.map(async t => ({item: await parseId(t), table: t[0], sid: t})));
}
export const isFavorisById = ([dbname, keyName, id]) => {
    return GLOBALS.storage.favoris.find(([d, k, i]) => d === dbname && k === keyName && i === id) != null;
}
export const isFavoris = (dbname, keyName, data) => {
    const id = generateId(dbname, keyName, data);
    return isFavorisById(id);
}
export const addFavorisById = (id) => {
    if(isFavorisById(id)) return;
    GLOBALS.storage.favoris.push(id);
    saveStorage();
}
export const addFavoris = (dbname, keyName, data) => {
    const id = generateId(dbname, keyName, data);
    addFavorisById(id);
}
export const removeFavorisById = ([dbname, keyName, id]) => {
    const index = GLOBALS.storage.favoris.findIndex(([d, k, i]) => d === dbname && k === keyName && i === id);
    if(index === -1) return;
    GLOBALS.storage.favoris.splice(index, 1);
    saveStorage();
}
export const removeFavoris = (dbname, keyName, data) => {
    const id = generateId(dbname, keyName, data);
    removeFavorisById(id);
}

export const getRecherchesRecentes = (page, nb) => {
    return GLOBALS.storage.recherches[page].slice(0, nb);
}
export const getAllRecherches = () => {
    return GLOBALS.storage.recherches;
}
export const limitRecherches = (page, nb) => {
    GLOBALS.storage.recherches[page] = getRecherchesRecentes(page, nb);
    saveStorage();
}
export const addRecherche = (page, recherche) => {
    const prev = GLOBALS.storage.recherches[page].indexOf(recherche);
    if(prev !== -1) GLOBALS.storage.recherches[page].splice(prev, 1);
    GLOBALS.storage.recherches[page].unshift(recherche);
    saveStorage();
}

export const getParcours = () => {
    return GLOBALS.storage.parcours;
}
export const addParcours = (parcours) => {
    GLOBALS.storage.parcours.push(parcours);
    saveStorage();
}
export const removeParcours = (id) => {
    const index = GLOBALS.storage.parcours.findIndex(p => p.id == id);
    console.log(index, id);
    if(index === -1) return;
    GLOBALS.storage.parcours.splice(index, 1);
    saveStorage();
}
export const updateParcours = (id, parcours) => {
    const index = GLOBALS.storage.parcours.findIndex(p => p.id == id);
    if(index === -1) return;
    GLOBALS.storage.parcours[index] = parcours;
    saveStorage();
}
export const getParcoursById = (id) => {
    return GLOBALS.storage.parcours.find(p => p.id == id);
}
export const getParcoursByName = (name) => {
    return GLOBALS.storage.parcours.find(p => p.name === name);
}
export const getNextParcoursId = () => {
    return GLOBALS.storage.parcours.length;
}
export const getParcode = (id) => {
    const parcours = getParcoursById(id);
    if(!parcours) return null;
    return LZString.compressToEncodedURIComponent(JSON.stringify(parcours));
}
export const fromParcode = (parcode) => {
    const parcours = JSON.parse(LZString.decompressFromEncodedURIComponent(parcode));
    return parcours;
}

window.getStorage = () => {
    return GLOBALS.storage;
}
