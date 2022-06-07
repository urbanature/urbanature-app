export const loadStorage = () => {
    const storage = localStorage.getItem('ud_storage');
    if (storage) {
        return JSON.parse(storage);
    }
    return {
        favoris: [],
        recherches: {
            decouvrir: [],
            explorer: [],
        }
    };
}
export const saveStorage = (storage) => {
    localStorage.setItem('ud_storage', JSON.stringify(storage));
}

export const loadCache = () => {
    const cache = localStorage.getItem('ud_cache');
    if (cache) {
        return JSON.parse(cache);
    }
    return {};
}
export const saveCache = (cache) => {
    localStorage.setItem('ud_cache', JSON.stringify(cache));
}

export const initData = () => {
    saveStorage(loadStorage());
    saveCache(loadCache());
}



export const getCache = (key) => {
    const cache = loadCache();
    return cache[key];
}
export const setCache = (key, value) => {
    const cache = loadCache();
    cache[key] = value;
    saveCache(cache);
}
export const delCache = (key) => {
    const cache = loadCache();
    delete cache[key];
    saveCache(cache);
}

