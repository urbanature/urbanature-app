export const table = [];
export const flags = {
    loaded: false,
};
export const on = {
    load: () => {},
};

export const initData = async () => {
    /** @type {{name,path,marker,table,data}[]} */
    const loaded_table = await fetch("/database/json/table.json")
                            .then(res => res.json());
    for(const t of loaded_table) {
        t.table = await fetch(`/database/json/${t.path}/table.json`)
                            .then(res => res.json());
    }
    loaded_table.forEach(t => table.push(t));
    flags.loaded = true;
    on.load();
}

export const fetchData = async (dbName, keyName) => {
    const db = table.find(t => t.path === dbName);
    const tab = db.table.find(t => t.key === keyName);
    const data = await fetch(`/database/json/${db.path}/data/${tab.path}`)
                            .then(res => res.json());
    return data;
}

export const fetchAllData = async (dbName) => {
    const db = table.find(t => t.name === dbName);
    const allData = [];
    for(const t of db.table) {
        const data = await fetchData(dbName, t.key);
        allData.push({key: t.key, name: t.name, data});
    }
    return allData;
}
