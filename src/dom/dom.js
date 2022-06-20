import { updateMapPosition, initMap, updateMapSize, clearLayers, unhideMap } from "./map.js";
import { loadPage } from "./page.js";
import { delay, imgToSvg, stripUrl } from "../misc.js";
import { on, setHash, setHref } from "../history.js";

export const globals = {
    current_url: "",
    transition_in_progress: false,
}

export const onStart = {
    accueil: () => {},
    decouvrir: () => {},
    explorer: () => {},
    parcourir: () => {},
    profil: () => {}
};
export const onClose = {
    accueil: async () => {},
    decouvrir: () => {},
    explorer: async () => {},
    parcourir: () => {},
    profil: () => {}
}

const $__dom__page = $('#__dom__page');
const $__dom__navbar = $('#__dom__navbar');

const closePage = async (url) => {
    clearLayers();
    unhideMap($__dom__page);
    globals.transition_in_progress = true;
    $("#__dom__loadico").removeClass("hidden");
    if(globals.current_url) {
        try { await onClose[globals.current_url](); } catch(e) { console.error(e); }
    }
    $__dom__page.off('click', 'a', handleAclick);
    $__dom__page.empty();
}
const openPage = async (url, navigating = false) => {
    let lone_url = stripUrl(url);
    updateNavbar(lone_url);
    await loadPage(`pages/${url}`, $__dom__page, navigating);
    updateMapPosition($__dom__page);
    imgToSvg();
    try { await onStart[lone_url](); } catch(e) { console.error(e); }
    $__dom__page.on('click', 'a', handleAclick);
    $("#__dom__loadico").addClass("hidden");
    globals.transition_in_progress = false;
}
const updateNavbar = (url) => {
    $(`.__link__button--active`).removeClass("__link__button--active");
    $(`a[href="${url}"]`).addClass('__link__button--active');
}
const updateUrlStatus = (url) => {
    globals.current_url = url;
    $__dom__page.attr('data-page', url);
}

$__dom__page.on('scroll', function() {
    if(globals.transition_in_progress) return;
    updateMapPosition($__dom__page, false);
});
$__dom__page.on('loadPage', async function(e, url, navigating = false) {
    let lone_url = stripUrl(url);
    if(globals.current_url === stripUrl(url)) {
        if(!url.includes("#")) {
            $__dom__page.animate({scrollTop: 0}, 500, 'swing');
        }
        const hash = url.split('#')[1];
        setHref(`/pages/${url}`);
        if(hash) setHash(hash);
        return;
    }
    await closePage(url);
    updateUrlStatus(lone_url);
    await openPage(url, navigating);
});

function handleAclick(e) {
    e.preventDefault();
    let url = $(this).attr('href');
    if(url[0] === '/') url = url.slice(1, url.length);
    if(url.includes('http')) {
        window.open(url, '_blank');
        return;
    }
    $__dom__page.trigger('loadPage', [url]);
}

$__dom__navbar.on('click', 'a', handleAclick);

export const openFirstPage = async (url) => {
    $__dom__page.trigger('loadPage', [url]);
}

on.navigate = (url) => {
    $__dom__page.trigger('loadPage', [url, true]);
}

initMap();