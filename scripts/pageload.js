import { loadPage, resetPage } from "./pages.js";

const aClickEvent = e => {
    e.preventDefault();
    // window.history.pushState({}, "", e.currentTarget.href);
    console.log(e.currentTarget)
    const href = e.currentTarget.getAttribute("href");
    if (href[0] == '#') {
        window.location.href = href;
    } else {
        reloadPage(href);
    }
}

const reloadPage = async (page = "accueil") => {
    resetPage();
    await loadPage(`/pages${(page[0] == '/' ? '' : '/') + page}`);
    document.querySelectorAll("a").forEach(a => {
        a.removeEventListener("click", aClickEvent);
        a.addEventListener("click", aClickEvent);
    });
    
};
reloadPage();
