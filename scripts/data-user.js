import { loadStorage , saveStorage } from "./data-loader";

/**
 * @typedef {Object} Favorite
 * @property {string} id
 * @property {string} category
 * @property {Date} date
 */

/**
 * @typedef {Object} Storage
 * @property {Favorite[]} favorites
 */

export const initData = () => {
    /** @type {Storage} */
    const storage = loadStorage();
    if (!storage.favorites) {
        storage.favorites = [];
    }
    saveStorage(storage);
}

export const FAVORITES = (() => {
    const list = () => {
        /** @type {Storage} */
        const storage = loadStorage();
        return storage.favorites;
    };
    const find = (id, category) => {
        /** @type {Storage} */
        const storage = loadStorage();
        return storage.favorites.find(favorite => favorite.id === id && favorite.category === category);
    };
    const inCategory = (category) => {
        /** @type {Storage} */
        const storage = loadStorage();
        return storage.favorites.filter(favorite => favorite.category === category);
    };
    const add = (id, category) => {
        /** @type {Storage} */
        const storage = loadStorage();
        if(find(id, category)) return;
        const favorite = {
            id, category, date: new Date()
        };
        storage.favorites.push(favorite);
        saveStorage(storage);
    };
    const remove = (id, category) => {
        /** @type {Storage} */
        const storage = loadStorage();
        storage.favorites = storage.favorites.filter(favorite => favorite !== find(id, category));
        saveStorage(storage);
    };
    return { list, find, inCategory, add, remove };
})();
