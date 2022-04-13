export const loadStorage = () => {
    const storage = localStorage.getItem('storage');
    if (storage) {
        return JSON.parse(storage);
    }
    return {};
}

export const saveStorage = (storage) => {
    localStorage.setItem('storage', JSON.stringify(storage));
}

