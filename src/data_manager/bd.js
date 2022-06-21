export const categories = [];
export const table = [];
export const flags = {
    loaded: false,
};
export const on = {
    load: () => {},
};

export const initData = async () => {
    /** @type {{name,path,marker,table,data,key_path,name_path}[]} */
    const loaded_table = await fetch("database/json/table.json")
                            .then(res => res.json());
    const loaded_categories = await fetch("database/json/categories.json")
                                .then(res => res.json());
    for(const t of loaded_table) {
        t.table = await fetch(`database/json/${t.path}/table.json`)
                            .then(res => res.json());
    }
    loaded_table.forEach(t => table.push(t));
    loaded_categories.forEach(c => categories.push(c));
    flags.loaded = true;
    on.load();
}

export const fetchData = async (dbName, keyName) => {
    const db = table.find(t => t.path === dbName);
    if(!db) {
        throw new Error(`Database ${dbName} not found`);
    }
    const tab = db.table.find(t => t.key === keyName);
    const data = await fetch(`database/json/${db.path}/data/${tab.path}`)
                            .then(res => res.json());
    return data;
}

export const fetchAllData = async (dbName) => {
    const db = table.find(t => t.path === dbName);
    const allData = [];
    for(const t of db.table) {
        const data = await fetchData(db.path, t.key);
        allData.push({key: t.key, name: t.name, data});
    }
    return allData;
}

export const getDatabases = () => {
    return table.map(t => t.path);
}
export const getTableFromDatabase = (dbName) => {
    const db = table.find(t => t.path === dbName);
    if(!db) {
        throw new Error(`Database ${dbName} not found`);
    }
    return db.table;
}
export const getTableMetaData = (dbName) => {
    const db = table.find(t => t.path === dbName);
    if(!db) {
        throw new Error(`Database ${dbName} not found`);
    }
    return db;
}

window.data_table = table;
window.getDatabases = getDatabases;
window.fetchData = fetchData;
window.fetchAllData = fetchAllData;
window.getTableFromDatabase = getTableFromDatabase;
window.getTableMetaData = getTableMetaData;