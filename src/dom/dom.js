import { updateMapPosition } from "./map.js";
import { loadPage } from "./page.js";
import { imgToSvg } from "../misc.js";

export const onStart = {
    accueil: () => {},
    explorer: () => {},
};

const $__dom__page = $('#__dom__page');
const $__dom__navbar = $('#__dom__navbar');

$__dom__page.on('scroll', function() {
    updateMapPosition($__dom__page, false);
});
$__dom__page.on('loadPage', async function(e, url) {
    $__dom__page.empty()
                .attr('data-page', url);
    await loadPage(`/pages/${url}`, $__dom__page);
    updateMapPosition($__dom__page);
    imgToSvg();
    onStart[url]();
});

$__dom__navbar.on('click', 'a', function(e) {
    e.preventDefault();
    let url = $(this).attr('href');
    if(url === '#') return;
    if(url[0] === '/') url = url.slice(1, url.length);
    $__dom__page.trigger('loadPage', [url]);
});

export const openFirstPage = async (url) => {
    $__dom__page.trigger('loadPage', [url]);
}
