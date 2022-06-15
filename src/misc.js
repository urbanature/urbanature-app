export const updateVh = () => {
    const vh = window.innerHeight * 0.01;
    $(document.body).css('--vh', `${vh}px`);
}

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * @type {{src: string, content: string}}
 */
let url_cache = [];
const fetchOrCache = async (src) => {
    let match = url_cache.find(x => x.src === src);
    if(!match) {
        let content = await fetch(src).then(r => r.text());
        match = {src, content};
        url_cache.push(match);
    }
    return match.content;
}
window.url_cache = url_cache;

export const imgToSvg = async () => {
    const imgs = $('img.svg-img').get();
    for(let img of imgs) {
        const $img = $(img);
        const src = $img.attr('src');
        if(!src.endsWith('.svg')) continue;
        const content = await fetchOrCache(src);
        const $svg = $(content);
        const img_class = $img.attr('class');
        const $svg_div = $(`<div class="${img_class ?? ""} svg">`);
        $svg_div.append($svg);
        $img.replaceWith($svg_div);
    }
}

export const findInt = (str = "") => {
    return str ? (parseInt(str) || findInt(str.slice(1))) : NaN;
}

const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
export const invlerp = (x, y, a) => clamp((a - x) / (y - x));

export const stripUrl = (url) => url.split("?")[0].split("#")[0];