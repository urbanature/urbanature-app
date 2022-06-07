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

export const setHref = (url) => {
    if(url.includes("accueil")) {
        window.history.pushState({}, "", "/");
        return;
    }
    const new_url = location.origin + "/" + url.split("pages/")[1];
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
