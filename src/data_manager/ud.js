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
        }
    }
};

export const generateId = (dbname, keyName, id) => {
    return [dbname, keyName, id];
}
const parseId = async ([dbname, keyName, id]) => {
    const table = await BASEDATA.fetchData(dbname, keyName);
    if(!table) return null;
    return table.find(({id: tid}) => tid === id);
}

export const loadStorage = () => {
    const ud_storage = localStorage.getItem('ud_storage') ?? "";
    const storage = LZString.decompress(ud_storage);
    if (storage) {
        const sto = JSON.parse(storage);
        if(sto.favoris)
                GLOBALS.storage.favoris = sto.favoris;
        else    GLOBALS.storage.favoris = [];
        if(sto.recherches.accueil)
                GLOBALS.storage.recherches.accueil = sto.recherches.accueil;
        else    GLOBALS.storage.recherches.accueil = [];
        if(sto.recherches.decouvrir)
                GLOBALS.storage.recherches.decouvrir = sto.recherches.decouvrir;
        else    GLOBALS.storage.recherches.decouvrir = [];
        if(sto.recherches.explorer)
                GLOBALS.storage.recherches.explorer = sto.recherches.explorer;
        else    GLOBALS.storage.recherches.explorer = [];
        if(sto.recherches.parcourir)
                GLOBALS.storage.recherches.parcourir = sto.recherches.parcourir;
        else    GLOBALS.storage.recherches.parcourir = [];
        if(sto.recherches.profil)
                GLOBALS.storage.recherches.profil = sto.recherches.profil;
        else    GLOBALS.storage.recherches.profil = [];
    } else {
        GLOBALS.storage = {
            favoris: [],
            recherches: {
                accueil: [],
                decouvrir: [],
                explorer: [],
                parcourir: [],
                profil: []
            }
        };
    }
    return GLOBALS.storage;
}
export const saveStorage = () => {
    const storage = JSON.stringify(GLOBALS.storage);
    const ud_storage = LZString.compress(storage);
    localStorage.setItem('ud_storage', ud_storage);
}
export const initData = () => {
    loadStorage();
    saveStorage();
    localStorage.setItem("Why does ud_storage look chinese?", "Enter the command readStorage() in the console to see the content of the storage.");
}
export const readUdStorage = () => {
    return JSON.parse(LZString.decompress(localStorage.ud_storage));
}

export const getFavoris = () => {
    return GLOBALS.storage.favoris.map(parseId);
}
export const getFavorisAsync = async () => {
    return await Promise.all(GLOBALS.storage.favoris.map(parseId));
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
