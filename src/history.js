export const on = {
    navigate: (url) => {}
}

export const useAttemptedHref = () => {
    const href = sessionStorage.getItem("attempted-href");
    sessionStorage.removeItem("attempted-href");
    if(href) {
        window.history.replaceState({}, "", href);
    }
    return href;
}

export const getPageFromHref = () => {
    const href = window.location.href;
    let page = href.split("/").pop();
    if(!page) return "";
    page = page.split("?")[0];
    page = page.split("#")[0];
    return page;
}

export const getHrefFeaturing = (query_string = true, hash_string = true) => {
    const origin = window.location.origin + window.location.pathname;
    const query = window.location.search;
    const hash = window.location.hash;
    let output = origin;
    if(query_string) output += query;
    if(hash_string) output += hash;
    return output;
}

// The query string comes before the hash, as noted in RFC 3986 section 4.2
// https://tools.ietf.org/html/rfc3986#section-4.2
export const getQueryString = () => {
    const href = window.location.href;
    let queryString = href.split("?")[1];
    if(!queryString) return {};
    if(queryString.includes("#")) queryString = queryString.split("#")[0];
    const query = queryString.split("&");
    const query_obj = {};
    query.forEach(q => {
        const [key, value] = q.split("=");
        query_obj[key] = value;
    })
    return query_obj;
}
export const getHash = (as_query = false) => {
    const href = window.location.href;
    let hash = href.split("#")[1];
    if(as_query) {
        if(!hash) return {};
        const query = hash.split("&");
        const query_obj = {};
        query.forEach(q => {
            const [key, value] = q.split("=");
            query_obj[key] = value;
        })
        return query_obj;
    } else {
        if(!hash) return "";
        return hash;
    }
}

export const setHref = (url) => {
    if(url.includes("accueil")) {
        window.history.pushState({}, "", "/");
        return;
    }
    const new_url = location.origin + "/" + url.split("pages/")[1];
    window.history.pushState({}, "", new_url);
}
export const setQuery = (query = {}, keep_hash = true) => {
    let hash = ""
    if(keep_hash) hash = window.location.hash;
    const new_url = location.origin + "/" + getPageFromHref() + (
        Object.keys(query).length
        ? "?" + Object.entries(query).map(([key, value]) => `${key}=${value}`).join("&")
        : ""
    ) + hash;
    window.history.pushState({}, "", new_url);
}
export const addToQuery = (query_add = {}, keep_hash = true) => {
    let hash = ""
    if(keep_hash) hash = window.location.hash;
    let query = {...getQueryString(), ...query_add};
    const new_url = location.origin + "/" + getPageFromHref() + (
        Object.keys(query).length
        ? "?" + Object.entries(query).map(([key, value]) => `${key}=${value}`).join("&")
        : ""
    ) + hash;
    window.history.pushState({}, "", new_url);
}
export const removeFromQuery = (keys = [], keep_hash = true) => {
    let hash = ""
    if(keep_hash) hash = window.location.hash;
    const query = {...getQueryString()};
    keys.forEach(key => delete query[key]);
    const new_url = location.origin + "/" + getPageFromHref() + (
        Object.keys(query).length
        ? "?" + Object.entries(query).map(([key, value]) => `${key}=${value}`).join("&")
        : ""
    ) + hash;
    window.history.pushState({}, "", new_url);
}
export const setHash = (hash = "", keep_query = true) => {
    let query = ""
    if(keep_query) query = window.location.search;
    const new_url = location.origin + "/" + getPageFromHref() + query + (
        hash.length
        ? "#" + hash
        : ""
    );
    window.history.pushState({}, "", new_url);
}

window.addEventListener("popstate", () => {
    const page = getPageFromHref();
    if(page) {
        on.navigate(page);
    } else {
        on.navigate("accueil");
    }
});
